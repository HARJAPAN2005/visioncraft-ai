import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { appAgent } from './agent'

const app = new Hono()
app.use('/*', cors())

app.get('/', (c) => c.text('VisionCraft AI is Active 🟢'))

app.post('/process', async (c) => {
  try {
    const body = await c.req.parseBody()
    
    // 1. Get Text & File
    const prompt = body['prompt'] as string
    const imageFile = body['image'] as File // Hono handles files automatically!

    if (!prompt || !imageFile) return c.json({ error: "Missing data" }, 400)

    // 2. Convert File to Base64 for the AI
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    // 3. Run the Agent
    const result = await appAgent.invoke({
      userRequest: prompt,
      imageBase64: base64Image
    })

    return c.json({ 
      success: true, 
      original_analysis: result.detectedFeatures,
      final_image: result.generatedImageUrl 
    })

  } catch (e) {
    console.error(e)
    return c.json({ error: "Server Error" }, 500)
  }
})

export default app
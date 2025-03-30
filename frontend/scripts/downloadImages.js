const fs = require('fs')
const path = require('path')
const https = require('https')

const foodImages = {
  apples: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2',
  bananas: 'https://images.unsplash.com/photo-1543218024-57a70143c369',
  lettuce: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1',
  tomatoes: 'https://images.unsplash.com/photo-1546094098-3f3f3f3f3f3f',
  milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150',
  cheese: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d',
  yogurt: 'https://images.unsplash.com/photo-1550583724-b2692b85b150',
  butter: 'https://images.unsplash.com/photo-1550583724-b2692b85b150',
  chicken: 'https://images.unsplash.com/photo-1604508792623-8f2a24b27b95',
  beef: 'https://images.unsplash.com/photo-1604508792623-8f2a24b27b95',
  salmon: 'https://images.unsplash.com/photo-1604508792623-8f2a24b27b95',
  pork: 'https://images.unsplash.com/photo-1604508792623-8f2a24b27b95',
  bread: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
  bagels: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
  muffins: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
  croissants: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
  rice: 'https://images.unsplash.com/photo-1516684732162-798a0062be99',
  pasta: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856',
  beans: 'https://images.unsplash.com/photo-1547592166-23ac45744acd',
  cereal: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea'
}

const outputDir = path.join(__dirname, '../public/images/food')

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(outputDir, filename)
    const file = fs.createWriteStream(filepath)

    https.get(url, (response) => {
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        console.log(`Downloaded: ${filename}`)
        resolve()
      })
    }).on('error', (err) => {
      fs.unlink(filepath, () => {})
      reject(err)
    })
  })
}

async function downloadAllImages() {
  for (const [name, url] of Object.entries(foodImages)) {
    try {
      await downloadImage(url, `${name}.jpg`)
    } catch (error) {
      console.error(`Failed to download ${name}:`, error)
    }
  }
}

downloadAllImages().then(() => {
  console.log('All images downloaded successfully!')
}).catch(error => {
  console.error('Error downloading images:', error)
}) 
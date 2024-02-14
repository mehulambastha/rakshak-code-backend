const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const connectionToDB = require('./connection/dbConnection')
const {PDFDocument, rgb, grayscale, degrees} = require('pdf-lib')
const fs = require('fs')
const { dirname } = require('path')
dotenv.config()

const app = express()
app.use(bodyParser)
connectionToDB()


app.use("/user/", require('./routes/userRoutes'))

function generateLicenseNumber() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let licenseNumber = '';

  // Generate first 3 alphabets
  for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      licenseNumber += alphabet.charAt(randomIndex);
  }

  // Generate next 5 numbers
  for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      licenseNumber += numbers.charAt(randomIndex);
  }

  // Generate last 2 alphabets
  for (let i = 0; i < 2; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      licenseNumber += alphabet.charAt(randomIndex);
    }
    
    return licenseNumber;
}
// Generate a license number
const licenseNumber = generateLicenseNumber()


const writePdf = async () => {
  const document = await PDFDocument.create()
  const page = document.addPage()
  const date = new Date()
  const currentMonth = date.getMonth() + 1
  const currentYear = date.getFullYear()
  const pngProfileBuffer = fs.readFileSync('./profile.png', (err)=>console.log('error hua: ', err))
  const backgroundBuffer = fs.readFileSync('./bg.jpg', (err)=>console.log('error hua: ', err))
  
  const bgImage = await document.embedJpg(backgroundBuffer)
  const {height } = page.getSize()

  page.drawRectangle({
    x: 123,
    y: height - 300,
    width: 350,
    height: 200,
    borderWidth: 4,
    borderColor: grayscale(0)
  })

  page.drawImage(bgImage, {
    x: 123,
    y: height - 300,
    width: 350,
    height: 200,
  })


  page.moveRight(235)
  page.moveUp(height - 130)
  page.setFontSize(18)
  page.drawText('Learner\'s License')
  page.drawLine({
    start: {x: 123, y: height - 150},
    end: {x: 350+123, y: height - 150},
    thickness: 2,
    color: grayscale(0)
  })

  page.setFontSize(12)
  page.moveLeft(100)
  page.moveDown(45)

  page.drawText("Name:")
  page.drawText("Mehul Ambastha", {
    x: 200
  })

  const pngImage = await document.embedPng(pngProfileBuffer)
  const pngDims = pngImage.scale(0.1)

  page.drawImage(pngImage, {
    x: 350,
    y: height - 240,
    width: pngDims.width-120,
    height: pngDims.height-120,
    rotate: degrees(180)
  })

  page.moveDown(20)
  page.drawText("S/O:")
  page.drawText("Sanjay Ambastha", {
    x: 200
  })
  page.moveDown(20)
  page.drawText("Issued On:")
  page.drawText(`${currentMonth}/${currentYear}`, {
    x: 200
  })
  page.moveDown(20)
  page.drawText("Expiry:")
  page.drawText(`${currentMonth+3}/${currentYear}`, {
    x: 200
  })
  page.moveDown(30)
  page.drawLine({
    start: {x: 123, y: height - 250},
    end: {x: 123+350, y: height - 250},
    thickness: 2,
    color: grayscale(0)
  })
  page.moveDown(20)
  page.setFontSize(22)
  page.drawText(licenseNumber, {
    x: 234
  })
  


  console.log('creating file')
  const pdfBytes = await document.save()
  console.log('created')
  console.log('saving...')
  await fs.writeFile('./test.pdf', pdfBytes, (err)=>{
    if (err) {
      console.log('error')
    } else {
      console.log('saved!')
    }
  })
}


app.listen(process.env.PORT || 3009, ()=>{
  console.log('server fired up and running at port: ', process.env.PORT)
})

writePdf()
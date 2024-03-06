const getImagesButton = insert(g('image-wrap'), 'button')
getImagesButton.textContent = 'Get images'
getImagesButton.addEventListener('click', e => {
  getImagesButton.disabled = true
  document.body.classList.add('loading')

  imgflipGet().then(jsonGet => {
    if (jsonGet.success) {
      g('image-wrap').innerHTML = ''
      jsonGet.data.memes.forEach(meme => {
        const img = insert(g('image-wrap'), 'img')
        img.alt = meme.name
        img.dataset.id = meme.id
        img.src = meme.url
        img.addEventListener('click', e => {
          if (g('meme-text').value) {
            imgflipCap(meme.id, g('meme-text').value).then(jsonCap => {
              if (jsonCap.success) {
                renderPreview(jsonCap.data.url, '')
              } else {
                handleError(jsonCap.error_message)
              }
            })
          } else {
            handleError('Requires meme text so either type it or have the AI generate it')
            g('meme-text').focus()
          }
        })
      })
    } else {
      handleError(json.error_message)
    }
  })
})

const imgflipGet = async () => {
  console.log('api.imgflip.com/get_memes…')
  try {
    const response = await fetch(`https://api.imgflip.com/get_memes`)
    return response.json()
  } catch (error) {
    handleError(error)
  }
}

const imgflipCap = async (id, text) => {
  console.log('api.imgflip.com/caption_image…')
  try {
    const formData = new FormData()
    formData.append('username', 'MoonaDesign')
    formData.append('password', 'never-not-learning')
    formData.append('template_id', id)
    formData.append('font', 'Inter')
    formData.append('max_font_size', '40')
    // formData.append('text0', text)
    formData.append('text1', text)
    // formData.append('boxes', text)
    const response = await fetch(`https://api.imgflip.com/caption_image`, {
      method: 'POST',
      body: formData,
    })
    return response.json()
  } catch (error) {
    handleError(error)
  }
}

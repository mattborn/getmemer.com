const getImagesButton = insert(g('search-actions'), 'button')
getImagesButton.textContent = 'Get images'
getImagesButton.addEventListener('click', e => {
  g('error-bar').click()
  getImagesButton.disabled = true
  g('image-wrap').classList.add('loading')

  const query = g('search').value
  if (query) {
    imgflipSearch(query).then(json => {
      console.log(json)
      handleResults(json)
      getImagesButton.disabled = false
    })
  } else {
    imgflipGet().then(json => {
      handleResults(json)
      getImagesButton.disabled = false
    })
  }
})

const handleResults = json => {
  if (json.success) {
    if (json.data.memes.length) {
      g('image-wrap').innerHTML = ''
      json.data.memes.forEach(meme => {
        const img = insert(g('image-wrap'), 'img')
        img.alt = meme.name
        img.dataset.id = meme.id
        img.src = meme.url
        img.addEventListener('click', e => {
          window.scroll({
            behavior: 'smooth',
            left: 0,
            top: 0,
          })
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
      g('image-wrap').innerHTML = 'Hmm, couldn’t find any images for that. Try again!'
    }
  } else {
    handleError(json.error_message)
  }
  g('image-wrap').classList.remove('loading')
}

const imgflipCap = async (id, text) => {
  console.log('api.imgflip.com/caption_image …')
  try {
    const formData = new FormData()
    formData.append('username', 'MoonaDesign')
    formData.append('password', 'never-not-learning')
    formData.append('template_id', id)
    // formData.append('font', 'Inter')
    // formData.append('max_font_size', '40')
    formData.append('text0', text)
    // formData.append('text1', text)
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

const imgflipGet = async () => {
  console.log('api.imgflip.com/get_memes …')
  try {
    const response = await fetch(`https://api.imgflip.com/get_memes`)
    return response.json()
  } catch (error) {
    handleError(error)
  }
}

const imgflipSearch = async query => {
  console.log('api.imgflip.com/search_memes …')
  try {
    const formData = new FormData()
    formData.append('username', 'MoonaDesign')
    formData.append('password', 'never-not-learning')
    formData.append('query', query)
    // formData.append('nsfw', 1)
    const response = await fetch(`https://api.imgflip.com/search_memes`, {
      method: 'POST',
      body: formData,
    })
    return response.json()
  } catch (error) {
    handleError(error)
  }
}

const g = document.getElementById.bind(document)
const q = document.querySelectorAll.bind(document)

const insert = (target = document.body, tag = 'div') => {
  const el = document.createElement(tag)
  target.appendChild(el)
  return el
}

// generate text

const genTextButton = insert(g('base-actions'), 'button')
genTextButton.textContent = 'Generate text'
genTextButton.addEventListener('click', e => {
  const base_prompt = g('base-prompt').value
  if (base_prompt) {
    genTextButton.disabled = true
    document.body.classList.add('loading')

    sessionStream.push({
      role: 'user',
      content: `Return a single JSON object copying this schema: ${JSON.stringify({
        meme_text: `write meme copy about ${base_prompt}`,
      })} and use the values as hints for what to generate.`,
    })
    gpt4(sessionStream).then(text => {
      const json = toJSON(text)
      const { meme_text } = json
      g('meme-text').value = meme_text

      genTextButton.disabled = false
      document.body.classList.remove('loading')
    })
  } else {
    handleError('Base prompt is required')
    g('base-prompt').focus()
  }
})

// generate text & image AKA automeme

const genAutoButton = insert(g('base-actions'), 'button')
genAutoButton.textContent = 'Generate text & image'
genAutoButton.addEventListener('click', e => {
  const base_prompt = g('base-prompt').value
  if (base_prompt) {
    genAutoButton.disabled = true
    document.body.classList.add('loading')

    sessionStream.push({
      role: 'user',
      content: `Return a single JSON object copying this schema: ${JSON.stringify({
        meme_text: `rewrite "${base_prompt}" into the visible text for the meme which should be short and pithy like typical memes and try to stick with one of these: one does not simply X OR i don't always X, but when I do Y OR X, X everywhere OR not sure if X or Y OR X y u no Y OR y u no X OR brace yourself(ves) X OR X all the Y OR X that would be great OR X too damn Y OR yo dawg X OR X gonna have a bad time OR am I the only one around here X OR what if I told you X OR X ain't nobody got time for that OR X I guarantee it OR X annnnd it's gone OR X bats an eye Y loses their minds OR back in my day X OR X but that's none of my business OR you get X you get X everybody gets X`,
      })}`,
    })
    gpt4(sessionStream).then(text => {
      const json = toJSON(text)
      const { meme_text } = json
      g('meme-text').value = meme_text
      imgflipAuto(meme_text).then(json => {
        if (json.success) {
          renderPreview(json.data.url, meme_text)
        } else {
          handleError(json.error_message)
        }
        genAutoButton.disabled = false
        document.body.classList.remove('loading')
      })
    })
  } else {
    handleError('Base prompt is required')
    g('base-prompt').focus()
  }
})

const imgflipAuto = async text => {
  console.log('api.imgflip.com/automeme …', text)
  try {
    const formData = new FormData()
    formData.append('username', 'MoonaDesign')
    formData.append('password', 'never-not-learning')
    formData.append('text', text)
    const response = await fetch(`https://api.imgflip.com/automeme`, {
      method: 'POST',
      body: formData,
    })
    return response.json()
  } catch (error) {
    handleError(error)
  }
}

// helper methods

const handleError = msg => {
  console.error(msg)
  g('error-msg').textContent = msg
  g('error-bar').style.display = 'flex'
  window.scroll({
    behavior: 'smooth',
    left: 0,
    top: 0,
  })
}

g('error-bar').addEventListener('click', e => (g('error-bar').style.display = 'none'))

const renderPreview = (src, text) => {
  q('.meme-image').forEach(img => (img.src = src))
  q('.meme-text').forEach(txt => (txt.innerHTML = text))
}

// interpret image

// reset

const g = document.getElementById.bind(document)
const q = document.querySelectorAll.bind(document)

const insert = (target = document.body, tag = 'div') => {
  const el = document.createElement(tag)
  target.appendChild(el)
  return el
}
const generateButton = insert(g('actions'), 'button')
generateButton.textContent = 'Generate'
generateButton.addEventListener('click', e => {
  const base_prompt = g('base_prompt').value || 'no prompt entered'
  generateButton.disabled = true
  document.body.classList.add('loading')
})

const imgflipAuto = async text => {
  console.log('api.imgflip.com/automeme…', text)
  const formData = new FormData()
  formData.append('username', 'MoonaDesign')
  formData.append('password', 'never-not-learning')
  formData.append('text', text)
  const response = await fetch(`https://api.imgflip.com/automeme`, {
    method: 'POST',
    body: formData,
  })
  return response.json()
}

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

// if no base prompt, warn or have AI run without one

// if no meme text, warn or generate

// user clicks generate
// interpret text

// user clicks image
// fetch image generation points
// generate image generation points

// user clicks text
// generate text generation points

// interpret image

// reset

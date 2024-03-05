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

  imgflip(base_prompt).then(json => {
    console.log(json)
    if (json.success) {
      const img = insert(g('preview'), 'img')
      img.src = json.data.url
    } else {
      console.error(json.error)
    }
    generateButton.disabled = false
    document.body.classList.remove('loading')
  })

  // try {
  //   turbo([
  //     {
  //       role: 'system',
  //       content: `Generate content for a website about ${base_prompt}`,
  //     },
  //     {
  //       role: 'user',
  //       content: `Return a single JSON object copying this schema: ${JSON.stringify({
  //         color: 'hex value for trendy, relevant light brand color',
  //         dalle_prompt: 'prompt for DALL-E to generate a relevant image that includes "minimalist spot illustration"',
  //         headline: 'clever, pithy headline to be displayed in large bold type at top of home page',
  //         lede: ' lede immediately after headline',
  //         services: 'a comma-delimited list of 12 relevant services',
  //         services_h2: 'repeat three services each as one word as a list ending with and more',
  //       })} and use the values as hints.`,
  //     },
  //   ]).then(text => {
  //     const json = toJSON(text)
  //     const { color, dalle_prompt, headline, lede, services, services_h2 } = json
  //     const versionRef = userRef.push({
  //       base_prompt,
  //       business_name,
  //       color,
  //       created: Date.now(),
  //       headline,
  //       lede,
  //       services,
  //       services_h2,
  //       version,
  //     })
  //     image(dalle_prompt).then(text => versionRef.update({ image: text }))
  //     generateButton.disabled = false
  //     document.body.classList.remove('loading')
  //   })
  // } catch (error) {
  //   console.error(error)
  // }
})

// manage

const turbo = async messages => {
  // console.log('Fetching data…', messages)
  const response = await fetch(`https://us-central1-samantha-374622.cloudfunctions.net/turbo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messages),
  })
  return response.text()
}

const toJSON = str => {
  const curly = str.indexOf('{')
  const square = str.indexOf('[')
  let first
  if (curly < 0) first = '[' // only for empty arrays
  else if (square < 0) first = '{'
  else first = curly < square ? '{' : '['
  const last = first === '{' ? '}' : ']'
  // ensure JSON is complete
  let count = 0
  for (const c of str) {
    if (c === '{' || c === '[') count++
    else if (c === '}' || c === ']') count--
  }
  if (!count) return JSON.parse(str.slice(str.indexOf(first), str.lastIndexOf(last) + 1))
}

const dalle = async prompt => {
  // console.log('Fetching image…', prompt)
  const response = await fetch(`https://us-central1-samantha-374622.cloudfunctions.net/dalle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  })
  return response.text()
}

const imgflip = async text => {
  // console.log('Fetching image…', prompt)
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

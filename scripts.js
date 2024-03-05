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

  try {
    turbo([
      {
        role: 'system',
        content: `Generate input values to generate memes`,
      },
      {
        role: 'user',
        content: `Return a single JSON object copying this schema: ${JSON.stringify({
          meme_text: `rewrite "${base_prompt}" into the visible text for the meme which should be short and pithy like typical memes and try to stick with one of these: one does not simply X
          i don't always X, but when I do Y
          X, X everywhere
          not sure if X or Y
          X y u no Y
          y u no X
          brace yourself(ves) X
          X all the Y
          X that would be great
          X too damn Y
          yo dawg X
          X gonna have a bad time
          am I the only one around here X
          what if I told you X
          X ain't nobody got time for that
          X I guarantee it
          X annnnd it's gone
          X bats an eye Y loses their minds
          back in my day X
          X but that's none of my business
          you get X you get X everybody gets X`,
        })}`,
      },
    ]).then(text => {
      const json = toJSON(text)
      const { meme_text } = json
      imgflip(meme_text).then(json => {
        console.log(json)
        if (json.success) {
          const img = insert(g('preview'), 'img')
          img.src = json.data.url
        } else {
          alert(json.error_message)
        }
        generateButton.disabled = false
        document.body.classList.remove('loading')
      })
      generateButton.disabled = false
      document.body.classList.remove('loading')
    })
  } catch (error) {
    console.error(error)
  }
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
  console.log('Fetching image…', prompt)
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
  console.log('Fetching image…', text)
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

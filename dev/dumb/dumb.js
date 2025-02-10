const g = document.getElementById.bind(document)

const insert = (target = document.body, tag = 'div') => {
  const el = document.createElement(tag)
  target.appendChild(el)
  return el
}

const stream = [
  {
    role: 'system',
    content: `Write copy for generating memes`,
  },
]

// openai

const turbo = async messages => {
  console.log('samantha.cloudfunctions.net/openai …`', messages)
  try {
    const response = await fetch(`https://us-central1-samantha-374622.cloudfunctions.net/openai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: 'gpt-4-turbo-preview',
      }),
    })
    return response.text()
  } catch (error) {
    console.error(error)
  }
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

// demo

g('form').addEventListener('submit', e => {
  e.preventDefault()
  g('submit').disabled = true

  const prompt = g('prompt').value

  // immediate feedback
  const move = insert(g('outputs'))
  move.className = 'prompt'
  move.textContent = prompt

  // immediate feedforward

  g('prompt').value = 'Crafting text…'
  turbo([
    {
      role: 'user',
      content: `Return a single JSON object copying this schema: ${JSON.stringify({
        top_text: 'top meme text',
        bottom_text: 'bottom meme text',
        caption: 'optional text that appears before meme image',
      })} replacing values with copy for ${prompt}, and write something different this time.`,
    },
  ]).then(text => {
    const json = toJSON(text)
    console.log(json)
    const card = insert(g('outputs'))
    card.className = 'card'

    const p = insert(card, 'p')
    p.textContent = json

    g('prompt').value = ''
    g('prompt').focus()
    g('submit').disabled = false
  })
})

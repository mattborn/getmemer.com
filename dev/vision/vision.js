const g = document.getElementById.bind(document)

const insert = (target = document.body, tag = 'div') => {
  const el = document.createElement(tag)
  target.appendChild(el)
  return el
}

// openai

const vision = async messages => {
  console.log('samantha.cloudfunctions.net/openai …`', messages)
  try {
    const response = await fetch(`https://us-central1-samantha-374622.cloudfunctions.net/openai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        max_tokens: 512,
        messages,
        model: 'gpt-4-vision-preview',
      }),
    })
    return response.text()
  } catch (error) {
    console.error(error)
  }
}

// demo

g('form').addEventListener('submit', e => {
  e.preventDefault()
  g('submit').disabled = true
  const url = g('url').value
  g('url').value = 'Studying image…'
  vision([
    {
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url } },
        { type: 'text', text: 'What’s in this image?' },
      ],
    },
  ]).then(text => {
    insert(g('outputs'), 'hr')
    const img = insert(g('outputs'), 'img')
    img.src = url
    const p = insert(g('outputs'), 'p')
    p.textContent = `👆🏼 ${text}`
    g('url').value = ''
    g('url').focus()
    g('submit').disabled = false
  })
})

// state vars

const sessionStream = [
  {
    role: 'system',
    content: `Craft input values for generating memes`,
  },
]

// helper methods

const dalle = async prompt => {
  console.log('samantha.cloudfunctions.net/dalle …', prompt)
  try {
    const response = await fetch(`https://us-central1-samantha-374622.cloudfunctions.net/dalle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    })
    return response.text()
  } catch (error) {
    handleError(error)
  }
}

const gpt4 = async messages => {
  console.log('samantha.cloudfunctions.net/gpt4 …`', messages)
  try {
    const response = await fetch(`https://us-central1-samantha-374622.cloudfunctions.net/gpt4`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    })
    return response.text()
  } catch (error) {
    handleError(error)
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

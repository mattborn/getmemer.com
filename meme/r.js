alert('works!')

// inject styles
const c = document.createElement('link')
c.href = `https://rawcdn.githack.com/mattborn/getmemer.com/main/meme/r.css?v=${Date.now()}`
c.rel = 'stylesheet'
document.querySelector('head').appendChild(c)

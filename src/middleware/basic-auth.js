async function basicAuth(req, res, next) {

  const authToken = req.get('Authorization') || ''
  let basicToken

  if (!authToken.toLowerCase().startsWith('basic')) {
    console.log('no auth token')
    return res.status(401).json({ error: 'Missing basic token' })
  } else {
    basicToken = authToken.slice('basic '.length, authToken.length)
  }

  const [tokenUserName, tokenPassword] = Buffer.from(basicToken, 'base64')
    .toString()
    .split(':')

  if (!tokenUserName || !tokenPassword) {
    // console.log('!tokenUserName || !tokenPassword')
    return res.status(401).json({ error: 'Unauthorized request' })
  }

  // async
  try{
    const user = await req.app.get('db')('thingful_users')
      .where({user_name: tokenUserName})
      .first('*')

    if(!user || user.password !== tokenPassword){
      console.log(user, user.password, tokenPassword)
      return res.status(401).json({error: 'Unauthorized Request'})
    }
  } catch(e){
    next()
  }

  // next() got rid of this and it works? why? oh wait it wasn't done with it's async call and runs this b4 its done 
}

module.exports = {
  basicAuth
}

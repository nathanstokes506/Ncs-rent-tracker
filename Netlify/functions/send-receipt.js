exports.handler = async function(event, context) {
  if(event.httpMethod !== 'POST') return {statusCode:405,body:'Method Not Allowed'};
  
  try {
    var body = JSON.parse(event.body);
    var key = body.key;
    var to = body.to;
    var subject = body.subject;
    var html = body.html;
    
    if(!key||!to||!subject||!html) return {statusCode:400,body:JSON.stringify({error:'Missing fields'})};

    var response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'NCS Property Management <onboarding@resend.dev>',
        to: to,
        subject: subject,
        html: html
      })
    });

    var data = await response.json();
    return {
      statusCode: response.ok ? 200 : 400,
      headers: {'Access-Control-Allow-Origin': '*'},
      body: JSON.stringify(data)
    };
  } catch(e) {
    return {statusCode:500, headers:{'Access-Control-Allow-Origin':'*'}, body:JSON.stringify({error:e.message})};
  }
};

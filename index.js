import fetch from 'node-fetch';

let credentials = [
  {"jwt": "", "inputeth": "", "inputbtc": ""},
  {"jwt": "", "inputeth": "", "inputbtc": ""}
]

let iterator = 0;

function claim(channelId, itemId, jwt, userInput){
  let response = fetch(`https://api.streamelements.com/kappa/v2/store/${channelId}/redemptions/${itemId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization':  `Bearer ${jwt}`,
      'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15"
    },
    body: JSON.stringify({"input": [userInput]})
  });
  response.then(
      (claim) =>
          claim.json().then(
              claim => {
                console.log(claim);
                if (claim.item) {
                  console.log("claimed", userInput);
                  iterator += 1;
                }
              }
          ).catch(err => console.log(err))
  ).catch(
      (err) => {
        console.error(err);
      }
  );
}

function callback(channelId){
  if (iterator == credentials.length) {
    iterator = 0;
  }

  fetch(`https://api.streamelements.com/kappa/v2/store/${channelId}/items`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15"
    }
  })
      .then(
          data => data.json().then(
              data => {
                let foundeth = data.find(element => element._id == "");
                let foundbtc = data.find(element => element._id == "");
                if(foundeth.quantity.current != 0){
                  console.log("Item je dostupny!")
                  console.log(new Date());
                  claim(channelId, "", credentials[iterator].jwt, credentials[iterator].inputeth)
                }
                else if(foundbtc.quantity.current != 0){
                  claim(channelId, "", credentials[iterator].jwt, credentials[iterator].inputbtc)
                }
              }
          )
      ).catch(err => console.error(err))
}

callback("")
setInterval(
    () => callback(""),
    6050
);


// TODO make multi channel

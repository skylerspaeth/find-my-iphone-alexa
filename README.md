# Find my iPhone Alexa Skill
The goal of this skill is to be able to find your phone with ease.
If it's missing, simply say "Alexa, ask locator to find my phone".
## Setup
To begin setting up this skill, you must create an Amazon Developer account.
Click [here](https://developer.amazon.com/edw/home.html) to access the Amazon Developer Console and begin the skill creation.
Select "Get Started" under "Alexa Skills Kit" and follow the instructions to setup your skill.

Amazon provides a tutorial on how to do this [here](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/registering-and-managing-alexa-skills-in-the-developer-portal) if you'd like more detail.

With this repo's current code, here is the **intent schema** we are using:
```
{
  "intents": [
    {
      "intent": "Locator",
      "slots": [
        {
          "name": "relationship",
          "type": "relationship"
        },
        {
          "name": "device",
          "type": "device"
        }
      ]
    }
  ]
}
```

Add 2 custom slots matching `device-config.js`. For me, this looks like:
* Relationship: `mom,moms,mom's,dad,dads,dad's,mine,my,skyler,skylers,skyler's,claire,claires,claire's,doug,dougs,doug's`
* Device: `phone,iphone,pad,ipad,phones,iphones,pads,ipads`

Next, add some "Sample Utterances". These are how you interact with your skill, and must be prefixed with invocation name - in my case, Locator. I decided on these:
```
Locator Ring {relationship} {device}
Locator Play a sound on {relationship} {device}
Locator Find {relationship} {device}
Locator Where is {relationship} {device}
Locator Locate {relationship} {device}
Locator Where {relationship} {device} is
Locator What is {relationship} {device}
```
Using utterances with slots allows you to turn a say something like `"Alexa, ask locator to find Mom's phone"`.

Update the configuration file with your details. Modify `example_config.js` to your needs, then rename it to `config.js`.
The values are as follows:
+ **`username`:** Apple ID email
+ **`password`:** Apple ID password
+ **`address`:** Assumed location of Echo Dot, used to check distance to device
+ **`distanceUnits`:** Unit in which distance will be said

Use a deployer such as `serverless` to deploy the code to AWS. Insert your ARN into the `Alexa Skill Kit` page.

That's it! Try asking Alexa your utterances.

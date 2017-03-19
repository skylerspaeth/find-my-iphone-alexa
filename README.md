# Find my iPhone Alexa Skill
The goal of this skill is to be able to find your phone with ease.
If it's missing, simply say "Alexa, ask locator to find my phone".
## Setup
To begin setting up this skill, you must create an Amazon Developer account.
Click [here](https://developer.amazon.com/edw/home.html) to access the Amazon Developer Console and begin the skill creation.
Select "Get Started" under "Alexa Skills Kit" and follow the instructions to setup your skill.

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


Amazon provides a tutorial on how to do this [here](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/registering-and-managing-alexa-skills-in-the-developer-portal).

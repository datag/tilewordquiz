export const AiQuestion = (() => {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    let apiKey = null;

    let previousQuestions = [];

    function setApiKey(key) {
        apiKey = key;
    }

    async function generateQuestion(language, topic, temperature) {
        const outputExample = {
            type: "emoji",
            options: [
                { value: "Car", option: "🚗" },
                { value: "Bicycle", option: "🚲" },
                { value: "Airplane", option: "✈️" },
                { value: "Ship", option: "🚢" },
            ],
            note: "Means of transport",
        };

        const systemMessage = `
You generate a question with 4 options for use in a quiz app. I'll provide you with the desired language and an optional topic (may be in any language).
Rules:
* You always answer with options in the requested language.
* Even if I provide the topic or previous answers in another language, you always stick to the language I asked for.
* You stick to the provided topic. Only if the topic is empty, you choose a random topic yourself.
* The 4 options should be consistent with the topic.
* Only one of the options must be the correct answer.
* The emoji options must be unambiguous/distinguishable/recognizable to the player.
* Do not use the same emoji in a question multiple times.
* Your options emoji consist of a single unicode character, mostly an emoji.

Example input:
\`\`\`
Language: en (English)
Topic: Verkehrsmittel
\`\`\`

Example output:
\`\`\`json
${JSON.stringify(outputExample, null, 2)}
\`\`\`

Exclude words and emojis from the following list:
${getPreviousQuestions(10).map((question) => `* ${question}`).join("\n")}
    `.trim();

        const userMessage = `
\`\`\`
Language: ${language}
Topic: ${topic}
\`\`\`
    `.trim();

        const data = {
            "model": "gpt-4o-mini",
            "messages": [
              {
                "role": "system",
                "content": [
                  {
                    "type": "text",
                    "text": systemMessage
                  }
                ]
              },
              {
                "role": "user",
                "content": [
                  {
                    "type": "text",
                    "text": userMessage
                  }
                ]
              }
            ],
            "temperature": temperature,
            "response_format": {
              "type": "json_schema",
              "json_schema": {
                "name": "question",
                "strict": true,
                "schema": {
                  "type": "object",
                  "properties": {
                    "type": {
                      "type": "string",
                      "description": "The internal type of the question",
                      "enum": [
                        "emoji"
                      ]
                    },
                    "options": {
                      "type": "array",
                      "description": "The question's answer options, exactly 4 items",
                      "items": {
                        "type": "object",
                        "properties": {
                          "value": {
                            "type": "string"
                          },
                          "option": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "value",
                          "option"
                        ],
                        "additionalProperties": false
                      }
                    },
                    "note": {
                        "type": "string",
                        "description": "The chosen topic"
                      },
                  },
                  "additionalProperties": false,
                  "required": [
                    "type",
                    "options",
                    "note"
                  ]
                }
              }
            }
        };

        const result = await performStructuredRequest(data);
        if (!result.error) {
            previousQuestions.push(result.data);
        }
        return result;
    }

    function getPreviousQuestions(count) {
        let nLastQuestions = previousQuestions.slice(-count);
        return nLastQuestions.map((question) => {
            return question.options.map((option) => `${option.value} ${option.option}`).join(", ");
        });
    }

    async function generateTopics(count) {
        const systemMessage = `
You generate random ${count} topics for a quiz app which uses unicode emojis for its questions.
The generated topics should be suitable for emoji classes, don't contain a comma and be given in German language.

Example output:
\`\`\`json
[
  "Verkehrsmittel",
  "Obst",
  "Gemüse",
  "Haustiere",
  "Farben",
  "Berufe",
  "Sportarten",
  "Werkzeug",
  "Liebe",
  "Möbel"
]
\`\`\`
`.trim();

        const data = {
            "model": "gpt-4o-mini",
            "messages": [
              {
                "role": "system",
                "content": [
                  {
                    "type": "text",
                    "text": systemMessage
                  }
                ]
              }
            ],
            "temperature": 1,
            "response_format": {
              "type": "json_schema",
              "json_schema": {
                "name": "topics",
                "strict": true,
                "schema": {
                  "type": "object",
                  "properties": {
                    "topics": {
                      "type": "array",
                      "description": "Topics list",
                      "items": {
                        "type": "string"
                      },
                    }
                  },
                  "additionalProperties": false,
                  "required": [
                    "topics"
                  ]
                }
              }
            }
        };

        return await performStructuredRequest(data);
    }

    async function performStructuredRequest(data) {
        console.log(data);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                try {
                    const reply = JSON.parse(result.choices[0].message.content);
                    console.log(reply);
                    return {data: reply, error: null};
                } catch (error) {
                    return {data: null, error: `JSON Parse Error: ${error.message}`};
                }
            } else {
                return {data: null, error: `Error: ${result.error.message}`};
            }
        } catch (error) {
            return {data: null, error: `Network Error: ${error.message}`};
        }
    }

    return {
        setApiKey,
        generateQuestion,
        generateTopics,
    };
})();

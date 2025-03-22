import OpenAI from "openai";
const openai = new OpenAI({ apiKey: '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'});


const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
        role: "user",
        content: [
            { type: "text", text: "Give your best guess on where this image is located. Try to name the country, state, region, street name, etc, try to keep it to just the location, no other words" },
            {
                type: "image_url",
                image_url: {
                    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/640px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
                },
            },
        ],
    }],
});

console.log(response.choices[0].message.content);

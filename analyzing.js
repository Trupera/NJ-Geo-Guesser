const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('image-preview');
const results = document.getElementById('results');
const apiKeyInput = document.getElementById('apiKeyInput');
window.imgURL = "";

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            window.imgURL = e.target.result;
            preview.innerHTML = `<img src="${e.target.result}" width="300">`;
        };
        reader.readAsDataURL(file);
    }
});

async function analyzeImage() {
    if (!results) {
        console.error("Element with id 'results' not found!");
        return;
    }

    const file = imageInput.files[0];
    if (!file) {
        results.innerHTML = "Please upload an image first!";
        return;
    }

    // Get the API key from the input field
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
        results.innerHTML = "Please enter a valid API key!";
        return;
    }

    results.innerHTML = "Analyzing image...";

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Give your best guess on where this image is located. Try to name the country, state, region, street name, etc." },
                            {
                                type: "image_url",
                                image_url: { url: window.imgURL }
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (data.choices && data.choices.length > 0) {
            results.innerText = data.choices[0].message.content;
        } else {
            results.innerText = "No response from AI.";
        }
    } catch (error) {
        console.error("Error analyzing image:", error);
        results.innerText = "Error analyzing image. Check console for details.";
    }
}

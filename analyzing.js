const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('image-preview');
const results = document.getElementById('results');
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

    results.innerHTML = "Analyzing image...";

    try {
        const apiKey = "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";

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
                            { type: "text", text: "Give your best guess on where this image is located. Try to name the country, state, region, street name, etc., keeping it just the location, no other words. Always try to give an answer even if you're not sure. If you are unsure, state that you're unsure, but still guess." },
                            {
                                type: "image_url",
                                image_url: { url: window.imgURL }  // This needs to be an external URL, not base64!
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

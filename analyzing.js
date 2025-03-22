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

document.addEventListener("DOMContentLoaded", function() {
  const imageInput = document.getElementById("imageInput");
  const preview = document.getElementById("image-preview");
  const results = document.getElementById("results");

  imageInput.addEventListener("change", () => {
      const file = imageInput.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              preview.innerHTML = `<img src="${e.target.result}" width="300">`;
          };
          reader.readAsDataURL(file);
      }
  });

  async function analyzeImage() {
      const file = imageInput.files[0];
      if (!file) {
          results.innerHTML = "Try me!";
          return;
      }

      const reader = new FileReader();
      reader.onload = async function (e) {
          const base64Image = e.target.result;
          results.innerHTML = "Analyzing image...";

          try {
              const response = await fetch("http://localhost:5000/analyze", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ imageBase64: base64Image }),
              });

              const data = await response.json();
              results.innerHTML = `Best guess: <strong>${data.location}</strong>`;
          } catch (error) {
              console.error("Error:", error);
              results.innerHTML = "Couldn't reach the AI model.";
          }
      };
      reader.readAsDataURL(file);
  }

  document.getElementById("analyzeButton").addEventListener("click", analyzeImage);
});

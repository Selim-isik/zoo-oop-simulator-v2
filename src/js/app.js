import flatpickr from "flatpickr";

flatpickr("#visitDate", {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  time_24hr: true,
});

const animals = [
  {
    id: 1,
    name: "Bluey",
    species: "Bird",
    age: 3,
    wingSpan: 30,
    image:
      "https://images.unsplash.com/photo-1541971126-d98efa910469?q=80&w=1583&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isHungry: true,
    soundId: "sound-bird",
  },
  {
    id: 2,
    name: "George",
    species: "Monkey",
    age: 5,
    skill: "Riding a bike",
    image:
      "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isHungry: true,
    soundId: "sound-monkey",
  },
  {
    id: 3,
    name: "Mike",
    species: "Lion",
    age: 8,
    skill: "King of the jungle",
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=400&q=80",
    isHungry: false,
    soundId: "sound-lion",
  },
  {
    id: 4,
    name: "Skeeter",
    species: "Dog",
    age: 2,
    image:
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80",
    isHungry: false,
    soundId: "sound-robotdog",
  },
];

let currentAnimal = null;
let currentAudio = null;

function renderAnimals() {
  const container = document.getElementById("animal-list");
  container.innerHTML = "";
  animals.forEach((animal) => {
    const card = document.createElement("a");
    card.href = animal.image;
    card.className =
      "bg-white rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition relative";
    card.innerHTML = `
      <img src="${animal.image}" alt="${animal.name}" class="mb-4 rounded-md w-full h-40 object-cover" />
      <h2 class="font-semibold text-xl">${animal.name}</h2>
      <p class="text-gray-600">${animal.species} - ${animal.age} yaşında</p>
    `;
    card.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(animal, card);
    });
    container.appendChild(card);
  });
}

const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");

function stopAudio() {
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
}

closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  stopAudio();
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    stopAudio();
  }
});

function openModal(animal) {
  currentAnimal = animal;
  document.getElementById("modalTitle").textContent = animal.name;
  document.getElementById(
    "modalSpecies"
  ).textContent = `Tür: ${animal.species}`;
  document.getElementById("modalAge").textContent = `Yaş: ${animal.age}`;
  document.getElementById("modalHungry").textContent = animal.isHungry
    ? "Durum: Aç"
    : "Durum: Tok";

  const savedNote = localStorage.getItem(`note_${animal.id}`) || "";
  document.getElementById("visitorNote").value = savedNote;
  document.getElementById("savedNote").textContent =
    savedNote || "(Henüz not yok)";

  document.getElementById("feedBtn").disabled = false;

  modal.classList.remove("hidden");
}

document.getElementById("saveNoteBtn").addEventListener("click", () => {
  const noteText = document.getElementById("visitorNote").value.trim();
  if (!currentAnimal) return;

  if (noteText === "") {
    iziToast.warning({
      title: "Uyarı",
      message: "Not boş olamaz!",
    });
    return;
  }

  localStorage.setItem(`note_${currentAnimal.id}`, noteText);
  document.getElementById("savedNote").textContent = noteText;
  iziToast.success({
    title: "Not kaydedildi",
    message: `${currentAnimal.name} için notunuz kaydedildi!`,
  });
});

document.getElementById("feedBtn").addEventListener("click", () => {
  if (!currentAnimal) return;

  if (!currentAnimal.isHungry) {
    iziToast.warning({
      title: "Uyarı",
      message: `${currentAnimal.name} zaten tok!`,
    });
    return;
  }

  showFeedAnimation(currentAnimal);

  currentAnimal.isHungry = false;
  document.getElementById("modalHungry").textContent = "Durum: Tok";
  iziToast.success({
    title: "Başarılı",
    message: `${currentAnimal.name} beslendi!`,
  });
  renderAnimals();
});

document.getElementById("clearNoteBtn").addEventListener("click", () => {
  if (!currentAnimal) return;

  const noteKey = `note_${currentAnimal.id}`;
  const savedNote = localStorage.getItem(noteKey);

  if (!savedNote) {
    iziToast.warning({
      title: "Uyarı",
      message: "Silinecek not yok.",
    });
    return;
  }

  localStorage.removeItem(noteKey);
  document.getElementById("visitorNote").value = "";
  document.getElementById("savedNote").textContent = "(Henüz not yok)";

  iziToast.info({
    title: "Not temizlendi",
    message: `${currentAnimal.name} için notunuz silindi.`,
  });
});

document.getElementById("playSoundBtn").addEventListener("click", () => {
  if (!currentAnimal || !currentAnimal.soundId) return;

  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const audioElement = document.getElementById(currentAnimal.soundId);
  if (audioElement) {
    currentAudio = audioElement;
    currentAudio.play();
  }
});

function showFeedAnimation(animal) {
  const cards = document.querySelectorAll("#animal-list a");
  cards.forEach((card) => {
    if (card.querySelector("h2").textContent === animal.name) {
      const heart = document.createElement("div");
      heart.className = "heart";
      heart.textContent = "❤️";
      card.appendChild(heart);
      setTimeout(() => heart.remove(), 1000);
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  renderAnimals();
});
window.addEventListener("DOMContentLoaded", () => {
  window.flatpickr("#visitDate", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    time_24hr: true,
  });

  const visitInput = document.getElementById("visitDate");
  const saveVisitBtn = document.getElementById("saveVisitBtn");
  const visitInfo = document.getElementById("savedVisitInfo");

  const storedVisit = localStorage.getItem("visitDate");
  if (storedVisit) {
    visitInfo.textContent = `Son ziyaret: ${storedVisit}`;
  }

  saveVisitBtn.addEventListener("click", () => {
    const date = visitInput.value.trim();
    if (date === "") {
      iziToast.warning({
        title: "Uyarı",
        message: "Lütfen bir ziyaret tarihi seçin!",
      });
      return;
    }

    localStorage.setItem("visitDate", date);
    visitInfo.textContent = `Ziyaret kaydedildi: ${date}`;
    iziToast.success({
      title: "Başarılı",
      message: "Ziyaret tarihi kaydedildi!",
    });
  });
});

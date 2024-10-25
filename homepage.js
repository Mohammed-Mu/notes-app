import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, getDocs, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCThqVcNaLCorsZpSCjUFDYAyNO6pBrb-A",
    authDomain: "notes-5628d.firebaseapp.com",
    projectId: "notes-5628d",
    storageBucket: "notes-5628d.appspot.com",
    messagingSenderId: "98577176674",
    appId: "1:98577176674:web:baf86633be017d27c4993b"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadNotes();
        } else {
            console.log("User not logged in");
        }
    });

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                await signOut(auth);
                console.log("User logged out");
                // Optionally, redirect or update the UI after logout
                window.location.href = 'index.html';
            } catch (error) {
                console.error("Error signing out: ", error);
            }
        });
    }

    async function loadNotes() {
        const notesContainer = document.getElementById('tasks');
        notesContainer.innerHTML = ''; // Clear existing content
        try {
            const notesSnapshot = await getDocs(collection(db, "notes"));
            notesSnapshot.forEach((doc) => {
                const noteData = doc.data();
                const noteElement = createListItem(noteData.heading, noteData.content);
                notesContainer.appendChild(noteElement);
            });
        } catch (error) {
            console.error("Error loading notes: ", error);
        }
    }

    function createListItem(heading, content) {
        const listItem = document.createElement('li');
        listItem.className = 'task-item';
        listItem.innerHTML = `
            <div class="note-details">
                <strong class="note-heading">${heading}</strong>
                <p class="note-content">${content}</p>
            </div>
        `;
        return listItem;
    }

    const addButton = document.getElementById('addTask');
    if (addButton) {
        addButton.addEventListener('click', async () => {
            const noteHeadingInput = document.getElementById('note-heading');
            const noteContentInput = document.getElementById('note-content');

            const noteHeading = noteHeadingInput.value.trim();
            const noteContent = noteContentInput.value.trim();

            if (noteHeading && noteContent) {
                try {
                    await addDoc(collection(db, "notes"), { heading: noteHeading, content: noteContent });
                    noteHeadingInput.value = ''; // Clear heading input field
                    noteContentInput.value = ''; // Clear content input field
                    loadNotes(); // Reload notes after adding
                } catch (error) {
                    console.error("Error adding note: ", error);
                }
            }
        });
    }
});

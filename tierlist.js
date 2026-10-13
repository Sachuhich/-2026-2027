const usersDatabase = [
    { name: "Чеганов Дмитрий", kostiks: [0] },
    { name: "Попов Кирилл", kostiks: [10, 5, 5, 1, 2] }, 
    { name: "Пономарёв Владислав", kostiks: [0] },
    { name: "Тихоньких Ярослав", kostiks: [0] },
    { name: "Беляев Георгий", kostiks: [0] },
    { name: "Селюнин Илья", kostiks: [0] },
    { name: "Епанешникова Ульяна", kostiks: [0] },
    { name: "Рожинова Дарья", kostiks: [0] },
    { name: "Слепнева Алёна", kostiks: [0] },
    { name: "Алексеева Яна", kostiks: [0] },
    { name: "Лагонда Юлианна", kostiks: [0] },
    { name: "Гришина Мария", kostiks: [0] },
    { name: "Ковалева Анастасия", kostiks: [0] },
    { name: "Коровина Дарья", kostiks: [0] },
    { name: "Корнилова София", kostiks: [0] },
    { name: "Писаренко Артём", kostiks: [0] },
    { name: "Казаков Алексей", kostiks: [0] }
];

let selectedUserName = null;

export function renderTierlist() {
    const ratingContainer = document.getElementById('rating-list');
    if (!ratingContainer) return;

    ratingContainer.innerHTML = ""; 

    const processedUsers = usersDatabase.map(user => {
        const totalSum = user.kostiks.reduce((sum, current) => sum + current, 0);
        return { name: user.name, points: totalSum, originalKostiks: user.kostiks };
    });

    const activeUsers = processedUsers.filter(user => user.points > 0);
    const zeroUsers = processedUsers.filter(user => user.points === 0);

    activeUsers.sort((a, b) => b.points - a.points);
    zeroUsers.sort((a, b) => a.name.localeCompare(b.name));

    activeUsers.forEach((user, index) => {
        createRatingRow(user, `${index + 1}.`, false, ratingContainer);
    });

    if (zeroUsers.length > 0) {
        const zeroSection = document.createElement('div');
        zeroSection.className = 'zero-users-section';
        
        zeroUsers.forEach(user => {
            createRatingRow(user, "", true, zeroSection);
        });

        ratingContainer.appendChild(zeroSection);
    }
}

function createRatingRow(user, placeMarker, isZero, container) {
    const row = document.createElement('div');
    row.className = `rating-row ${isZero ? 'zero-row' : ''} ${user.name === selectedUserName ? 'selected' : ''}`;
    row.style.cursor = 'pointer'; 

    row.onclick = function(e) {
        e.stopPropagation();
        toggleHistoryPanel(user.name);
    };

    if (!isZero) {
        row.innerHTML = `
            <span class="rating-position">${placeMarker}</span>
            <span class="rating-name">${user.name}</span>
            <span class="rating-score">${user.points} 🦴</span>
        `;
    } else {
        row.innerHTML = `
            <span class="rating-name">${user.name}</span>
            <span class="rating-score">${user.points} 🦴</span>
        `;
    }

    container.appendChild(row);

    if (user.name === selectedUserName) {
        const panel = document.createElement('div');
        panel.className = 'rating-details-panel';
        panel.onclick = function(e) { e.stopPropagation(); }; 

        if (user.points > 0) {
            const mathematicalString = user.originalKostiks.join(' + ');
            panel.innerHTML = `<div class="history-text">${mathematicalString} = ${user.points} 🦴</div>`;
        } else {
            panel.innerHTML = `<div class="history-text italic-text">Боец не участвовал в активностях</div>`;
        }

        container.appendChild(panel);
    }
}

function toggleHistoryPanel(userName) {
    if (selectedUserName === userName) {
        selectedUserName = null; 
    } else {
        selectedUserName = userName; 
    }
    renderTierlist(); 
}

document.addEventListener('click', function() {
    if (selectedUserName !== null) {
        selectedUserName = null;
        renderTierlist();
    }
});
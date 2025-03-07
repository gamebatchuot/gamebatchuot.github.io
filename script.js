// Khai báo các biến toàn cục
const character = document.getElementById('character');
const dialogBox = document.getElementById('dialog-box');
const restartBtn = document.getElementById('restart-btn');
const missCount = document.getElementById('miss-count');
const backgroundMusic = document.getElementById('background-music');
const musicToggleBtn = document.getElementById('music-toggle');
const memeContainer = document.getElementById('meme-container');
const memeImage = document.getElementById('meme-image');

// Các phần tử popup hướng dẫn
const helpBtn = document.getElementById('help-btn');
const helpPopup = document.getElementById('help-popup');
const closeHelpBtn = document.getElementById('close-help');

// Các nút chức năng
const restartGameBtn = document.getElementById('restart-game');

// Các nút chế độ chơi
const modeButtons = document.querySelectorAll('.mode-btn');

// Tham chiếu đến khu vực chơi game
const gameplayArea = document.querySelector('.gameplay-area');

// Tham chiếu đến thông báo trong gameplay
const gameNotification = document.getElementById('game-notification');
const notificationIcon = document.querySelector('.notification-icon');
const notificationText = document.getElementById('notification-text');

// Lấy tham chiếu đến game container chính
const gameContainer = document.getElementById('game-container');

// Biến dùng để theo dõi vị trí nhân vật
let characterX = 0;
let characterY = 0;

// Biến để theo dõi kích thước màn hình
let containerWidth = 0;
let containerHeight = 0;

// Set safe margin from edges to prevent sticking to borders
const safeMargin = 50;

// Biến theo dõi trạng thái game
let isGameOver = false;
let isMuted = false;
let missCounter = 0;
let difficultyLevel = 1;
let currentGameMode = 'normal'; // Chế độ mặc định

// Biến theo dõi nhân vật bổ sung (chế độ đa nhân vật)
let multipleCharacters = [];

// Mảng chứa tất cả các âm thanh di chuyển
const moveSounds = [
    document.getElementById('move-sound-1'),
    document.getElementById('move-sound-2'),
    document.getElementById('move-sound-3')
];

// Mảng chứa tất cả các âm thanh miss
const missSounds = [
    document.getElementById('miss-sound-1'),
    document.getElementById('miss-sound-2'),
    document.getElementById('miss-sound-3'),
    document.getElementById('miss-sound-4'),
    document.getElementById('miss-sound-5'),
    document.getElementById('miss-sound-6')
];

// Âm thanh khi bắt được
const catchSound = document.getElementById('catch-sound');

// Mảng các emoji khác nhau cho nhân vật
const characterEmojis = ['😜', '😝', '🤪', '😋', '😛', '🤩', '🥳', '😎', '🤓', '🤡', '👻', '👽', '🐱', '🐭', '🐵'];

// Các thiết lập theo chế độ chơi
const gameModes = {
    'normal': {
        jumpAnimationTime: 500,
        safeDistance: 100,
        memeFrequency: 0.05, // Tần suất xuất hiện meme theo số lần click hụt
        characterSpeed: 0.2, // Tốc độ di chuyển của nhân vật
        characterCount: 1, // Số lượng nhân vật
        moveClass: 'jump', // Class CSS cho kiểu di chuyển
        messageClass: '', // Class CSS cho tin nhắn troll
        specialMoveChance: 0.1, // Cơ hội di chuyển đặc biệt
        trollIntensity: 1, // Cường độ troll (1-5)
        memeLifespan: 2000, // Thời gian tồn tại của meme (ms)
        flashScreenChance: 0.05 // Cơ hội xuất hiện hiệu ứng flash màn hình
    },
    'fast': {
        jumpAnimationTime: 300,
        safeDistance: 150,
        memeFrequency: 0.07,
        characterSpeed: 0.1, // Nhanh hơn
        characterCount: 1,
        moveClass: 'fast-move', // Di chuyển kiểu trượt nhanh
        messageClass: 'fast-msg', // Tin nhắn kiểu nhanh
        specialMoveChance: 0.4, // Cơ hội cao hơn cho di chuyển đặc biệt
        trollIntensity: 3, // Cường độ troll cao hơn
        memeLifespan: 1500, // Meme xuất hiện nhanh hơn
        flashScreenChance: 0.1 // Cơ hội cao hơn xuất hiện hiệu ứng flash màn hình
    },
    'crazy': {
        jumpAnimationTime: 400,
        safeDistance: 120,
        memeFrequency: 0.15, // Nhiều meme hơn
        characterSpeed: 0.15,
        characterCount: 1,
        moveClass: 'crazy-move', // Di chuyển kiểu xoay tròn
        messageClass: 'crazy-msg', // Tin nhắn kiểu điên cuồng
        crazyMovement: true, // Di chuyển ngẫu nhiên hơn
        specialMoveChance: 0.7, // Cơ hội rất cao cho di chuyển đặc biệt
        trollIntensity: 5, // Cường độ troll tối đa
        multipleDialogs: true, // Nhiều hộp thoại cùng lúc
        memeLifespan: 3000, // Meme tồn tại lâu hơn
        flashScreenChance: 0.3, // Cơ hội rất cao xuất hiện hiệu ứng flash màn hình
        crazyEffectsChance: 0.4 // Cơ hội xuất hiện hiệu ứng điên cuồng
    },
    'multi': {
        jumpAnimationTime: 500,
        safeDistance: 100,
        memeFrequency: 0.05,
        characterSpeed: 0.2,
        characterCount: 3, // 3 nhân vật
        moveClass: 'curve-move', // Di chuyển theo đường cong
        messageClass: 'multi-msg', // Tin nhắn kiểu đa nhân vật
        specialMoveChance: 0.3, // Cơ hội di chuyển đặc biệt trung bình
        trollIntensity: 2, // Cường độ troll trung bình
        memeLifespan: 2500, // Meme tồn tại trung bình
        flashScreenChance: 0.08, // Cơ hội thấp xuất hiện hiệu ứng flash màn hình
        synchronizedMove: true // Các nhân vật di chuyển đồng bộ
    }
};

// Tin nhắn troll đặc biệt cho chế độ Fast
const fastModeTrollPhrases = [
    "Quá chậm, tôi đã ở đây rồi! ⚡",
    "Bạn cần một quả Red Bull không? 🐂",
    "Bắt tôi cũng nhanh như việc tải trang web trên 2G vậy! 🐢",
    "Có thể nói rằng phản xạ của bạn... không được nhanh cho lắm! 😎",
    "Tôi có thể hoàn thành 3 bài tập trong lúc bạn click chuột! ⏱️",
    "Bạn đang chơi bằng touchpad à? 🤔",
    "Bạn là Người Chạy Chậm Nhất Thế Giới phải không? 🥇",
    "Tốc độ của bạn bằng với tốc độ nạp tiền điện thoại vào ngày cuối tháng! 📱"
];

// Tin nhắn troll đặc biệt cho chế độ Crazy
const crazyModeTrollPhrases = [
    "CÓ PHẢI BẠN ĐANG THẤY HOANG MANG KHÔNG? 🤪",
    "Ô LA LA! Đây có phải là ĐIÊN CUỒNG hay chưa đủ?! 🎭",
    "À HA HA HA! Bạn sẽ KHÔNG BAO GIỜ bắt được tôi! 😵‍💫",
    "Tôi đang ở mọi nơi và không nơi nào cả! ĐIÊN CUỒNG! 🌀",
    "BẠN CÓ THỂ BẮT ĐƯỢC ĐIỀU GÌ ĐÓ KHÔNG TÁCH KHỎI HIỆN THỰC?! 🤯",
    "Đ-Đ-ĐỪNG XÉT ĐOÁN C-C-CÁC HÀNH ĐỘNG CỦA TÔI! 🪄",
    "Bạn có thích màu sắc không? TÔI THÌ CÓ! 🌈",
    "Bạn đã từng thấy một người đàn ông chạy với 12 cái bánh pizza chưa? TÔI THÌ CÓ! 🍕",
    "WHOOP WHOOP WHOOP WHOOP WHOOP! 🎡",
    "Đôi khi tôi cảm thấy như một cái TỦ LẠNH! 🧊"
];

// Tin nhắn troll đặc biệt cho chế độ Multi
const multiModeTrollPhrases = [
    "Chúng tôi là một đội! Bạn không thể thắng được! 👯‍♂️",
    "Bạn bắt một người, còn hai người nữa kìa! 🏃‍♂️🏃‍♀️🏃",
    "Có nhiều nhân vật quá đúng không? Có chút khó khăn chăng? 😏",
    "Một, hai, ba... nhiều quá phải không? 🧮",
    "Chúng tôi đang phân tâm bạn! Làm tốt lắm! 🎯",
    "Nếu nhân vật càng nhiều thì cơ hội càng cao... đâu có! 😂",
    "Chọn một người, chỉ một! Đừng bị đánh lừa! 🎭",
    "Có người đang cảm thấy choáng ngợp? 😎"
];

// Mảng câu thoại
const trollPhrases = [
    "Quá chậm rồi! 😂",
    "Bạn không thể bắt được tôi đâu! 🤣",
    "Gần rồi đấy... nhưng không đủ gần! 😜",
    "Rất tiếc! Thử lại lần nữa nhé! 🙃",
    "Bạn cần thêm luyện tập rồi! 😋",
    "Không đúng, không đúng rồi! 🙊",
    "Nhiều người cũng miss như bạn đó! 😏",
    "Ngày hôm nay không phải ngày may mắn của bạn! 🍀"
];

// Mảng câu thoại khi đã kích hoạt chế độ thương hại
const mercyPhrases = [
    "Tôi đang cố gắng giúp bạn đây! Gần quá mà không click trúng à? 😅",
    "Tôi đứng im không chạy nữa... ơ mà bạn vẫn miss à? 😳",
    "Không sao đâu, chỉ cần tập trung thêm một chút! 🎯",
    "Thử lại một lần nữa, bạn làm được mà! 💪",
    "Không phải lo lắng! Ai rồi cũng thắng thôi! ✌️",
    "Đừng lo, chế độ 'dễ thở' đã được kích hoạt! 😌"
];

// Mảng câu thoại khi bắt được
const caughtPhrases = [
    "Chà! Bạn đã bắt được tôi! 😱",
    "Quá xuất sắc! 👏",
    "Bạn là người giỏi nhất! 🏆",
    "Tôi đầu hàng! Bạn quá nhanh! ⚡",
    "Làm tốt lắm! 🎉",
    "Xin chúc mừng! Bạn thật tài giỏi! 🥳",
    "Hiếm có ai bắt được tôi đấy! 😎"
];

// Mảng câu thoại khi bắt được trong chế độ thương hại
const mercyCaughtPhrases = [
    "Phù... cuối cùng thì cũng bắt được tôi! 😌",
    "Không có gì phải xấu hổ cả, chiến thắng là chiến thắng! 🎖️",
    "Tôi đã cho bạn thắng đấy nhé! 😜",
    "Chúc mừng! Bạn đã hoàn thành thử thách này! 🏁",
    "Sau bao nhiêu cố gắng... bạn đã làm được rồi! 🙌"
];

// Mảng chứa đường dẫn đến các meme
const memes = [
    'meme/meme-khinh-bi-ba-dao-nhat_104754424.jpg',
    'meme/meme-khinh-bi-2.webp',
    'meme/meme-nhech-mep_104757748.jpg',
    'meme/ech-xanh-biu-moi-mat-nhin-khinh-bi-034dc5f1e3e0a7eaa317fddaa80951d0.jpg',
    'meme/meme-khinh-thuong-doc-dao_104756578.jpg',
    'meme/Hinh-meme-tho-bay-mau-cuoi-khinh-bi.jpg',
    'meme/khinh-bi-meme-2.jpg',
    'meme/meme-khinh-bi-10.webp',
    'meme/meme-khinh-bi-41.webp',
    'meme/d61b8069651bf2f0ee20478ebc61055c.jpg',
    'meme/wait-what.gif'
];

// Khởi tạo các sự kiện menu
function initMenuEvents() {
    // Thiết lập mặc định: Chọn chế độ Normal và đánh dấu là selected
    document.getElementById('mode-normal').classList.add('selected');
    
    // Bắt sự kiện click cho các nút chọn chế độ
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Xóa lớp selected khỏi tất cả các nút
            modeButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Thêm lớp selected cho nút được chọn
            button.classList.add('selected');
            
            // Lấy chế độ từ thuộc tính data-mode
            const selectedMode = button.getAttribute('data-mode');
            
            // Áp dụng chế độ
            applyGameMode(selectedMode);
            
            // Reset và khởi tạo lại game với chế độ mới
            initGame();
            
            // Hiển thị thông báo
            showDialog(`Đã chuyển sang chế độ ${getModeName(selectedMode)}!`, 
                      0, 0, 2000, false, 'mode');
        });
    });
    
    // Bắt sự kiện cho nút hướng dẫn
    helpBtn.addEventListener('click', () => {
        helpPopup.classList.remove('hidden');
    });
    
    // Bắt sự kiện cho nút đóng popup hướng dẫn
    closeHelpBtn.addEventListener('click', () => {
        helpPopup.classList.add('hidden');
    });
    
    // Bắt sự kiện cho nút bật/tắt âm thanh
    musicToggleBtn.addEventListener('click', toggleAudio);
    
    // Bắt sự kiện cho các nút chơi lại
    restartBtn.addEventListener('click', initGame);
    restartGameBtn.addEventListener('click', initGame);
    
    // Bắt sự kiện resize để cập nhật kích thước màn hình
    window.addEventListener('resize', updateScreenDimensions);
}

// Hàm lấy tên chế độ chơi
function getModeName(mode) {
    switch(mode) {
        case 'fast': return 'Siêu Tốc';
        case 'crazy': return 'Điên Cuồng';
        case 'multi': return 'Đa Nhân Vật';
        default: return 'Bình Thường';
    }
}

// Hiển thị menu chính
function showMenu() {
    gameMenu.classList.remove('hidden');
    gameContainer.classList.add('hidden');
    instructionsScreen.classList.add('hidden');
    modesScreen.classList.add('hidden');
}

// Hiển thị hướng dẫn
function showInstructions() {
    gameMenu.classList.add('hidden');
    instructionsScreen.classList.remove('hidden');
}

// Hiển thị màn hình chọn chế độ chơi
function showModes() {
    gameMenu.classList.add('hidden');
    modesScreen.classList.remove('hidden');
}

// Bắt đầu trò chơi
function startGame() {
    gameMenu.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    
    // Áp dụng thiết lập cho chế độ chơi đã chọn
    applyGameMode(currentGameMode);
    
    // Khởi tạo game
    initGame();
}

// Quay lại menu từ trong game
function returnToMenu() {
    // Dừng game
    isGameOver = true;
    
    // Dừng nhạc nền
    backgroundMusic.pause();
    
    // Gỡ bỏ các sự kiện
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('click', handleClick);
    
    // Xóa các nhân vật phụ nếu đang chơi chế độ đa nhân vật
    removeMultipleCharacters();
    
    // Hiển thị menu
    showMenu();
}

// Xóa các nhân vật phụ
function removeMultipleCharacters() {
    // Xóa tất cả các nhân vật phụ khỏi màn hình
    const extraCharacters = document.querySelectorAll('.extra-character');
    extraCharacters.forEach(char => {
        char.remove();
    });
    
    // Reset mảng
    multipleCharacters = [];
}

// Áp dụng thiết lập cho chế độ chơi
function applyGameMode(mode) {
    // Lưu chế độ chơi hiện tại
    currentGameMode = mode;
    
    // Nếu là chế độ đa nhân vật, tạo thêm nhân vật
    if (mode === 'multi') {
        const characterCount = gameModes[mode].characterCount || 3;
        createMultipleCharacters(characterCount);
    } else {
        // Xóa các nhân vật phụ nếu đang chơi các chế độ khác
        removeMultipleCharacters();
    }
}

// Tạo nhiều nhân vật (cho chế độ đa nhân vật)
function createMultipleCharacters(count) {
    // Xóa các nhân vật phụ cũ
    removeMultipleCharacters();
    
    // Tạo nhân vật phụ mới
    for (let i = 0; i < count - 1; i++) {
        // Sử dụng setTimeout để tạo nhân vật lần lượt, tránh lag
        setTimeout(() => {
            // Tạo phần tử nhân vật mới
            const extraChar = document.createElement('div');
            extraChar.className = 'character extra-character';
            extraChar.textContent = getRandomCharacterEmoji();
            
            // Đặt vị trí ngẫu nhiên
            const position = getRandomSafePosition();
            extraChar.style.left = position.x + 'px';
            extraChar.style.top = position.y + 'px';
            
            // Thêm vào DOM
            gameplayArea.appendChild(extraChar);
            
            // Thêm vào mảng quản lý
            multipleCharacters.push({
                element: extraChar,
                x: position.x,
                y: position.y,
                isMoving: false
            });
            
            // Thêm sự kiện click cho nhân vật phụ
            extraChar.addEventListener('click', (e) => {
                catchExtraCharacter(extraChar);
                e.stopPropagation(); // Ngăn chặn sự kiện click truyền đến nền
            });
        }, i * 200); // Tạo nhân vật cách nhau 200ms
    }
}

// Bắt nhân vật phụ
function catchExtraCharacter(element) {
    // Đánh dấu nhân vật đã bị bắt
    element.classList.add('caught');
    
    // Phát âm thanh
    playSound(catchSound);
    
    // Hiển thị câu thoại
    const rect = element.getBoundingClientRect();
    const x = rect.left - gameplayArea.getBoundingClientRect().left;
    const y = rect.top - gameplayArea.getBoundingClientRect().top;
    showDialog("Bạn đã bắt được tôi! Còn lại các bạn của tôi kìa!", x, y, 3500, true);
    
    // Xóa nhân vật khỏi mảng quản lý
    multipleCharacters = multipleCharacters.filter(char => char.element !== element);
    
    // Xóa nhân vật khỏi DOM sau một khoảng thời gian
    setTimeout(() => {
        element.remove();
    }, 1000);
    
    // Tạo nhân vật mới thay thế (để luôn có đủ số lượng nhân vật)
    setTimeout(() => {
        if (!isGameOver) {
            createMultipleCharacters(1);
        }
    }, 1500);
}

// Hàm di chuyển nhân vật đến vị trí ngẫu nhiên
function moveToRandomPosition() {
    if (!character) return; // Safety check

    // Update dimensions to ensure we're using current values
    updateScreenDimensions();
    
    // Get random position within safe margins
    const position = getRandomSafePosition();
    
    // Thêm class hiệu ứng di chuyển và xóa sau khi hoàn thành
    character.classList.add('moving');
    setTimeout(() => {
        character.classList.remove('moving');
        // Thêm hiệu ứng breathe sau khi di chuyển
        character.classList.add('idle');
    }, 400);
    
    // Cập nhật vị trí nhân vật
    character.style.left = position.x + 'px';
    character.style.top = position.y + 'px';
    
    // Cập nhật các biến theo dõi vị trí hiện tại
    characterX = position.x;
    characterY = position.y;
    
    // Áp dụng hiệu ứng di chuyển dựa trên chế độ chơi
    if (currentGameMode && gameModes[currentGameMode].moveClass) {
        // Xóa tất cả các class di chuyển trước đó
        character.classList.remove('fast-move', 'crazy-move', 'curve-move', 'mercy-move');
        
        // Thêm class di chuyển mới
        character.classList.add(gameModes[currentGameMode].moveClass);
    }
    
    // Phát âm thanh di chuyển nếu không tắt tiếng
    if (!isMuted) {
        // Chọn ngẫu nhiên một trong các âm thanh di chuyển
        playSound(getRandomSound(moveSounds));
    }
    
    // Khả năng khiêu khích tăng dần theo số lần click hụt
    if (missCounter >= 5) {
        const tauntChance = Math.min(0.7, 0.1 + (missCounter * 0.02));
        if (Math.random() < tauntChance) {
            // Đợi một lúc rồi khiêu khích
            setTimeout(() => {
                tauntPlayer();
            }, 1000);
        }
    }
}

// Throttle mouse movement handling
let lastMoveTime = 0;
const moveThrottleDelay = 50; // Milliseconds between move reactions

// Hàm xử lý sự kiện di chuyển chuột
function handleMouseMove(e) {
    const now = Date.now();
    if (now - lastMoveTime < moveThrottleDelay) return;
    lastMoveTime = now;
    
    // Đảm bảo chế độ chơi đa nhân vật xử lý khác
    if (currentGameMode === 'multi') {
        handleMultipleCharactersMouseMove(e);
        return;
    }
    
    // Trong chế độ bình thường, chỉ di chuyển nhân vật chính
    if (isGameOver) return;
    
    // Lấy vị trí chuột so với gameplay area
    const rect = gameplayArea.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Tính khoảng cách từ chuột đến nhân vật
    const dx = mouseX - characterX;
    const dy = mouseY - characterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Nếu chuột gần sẽ có hiệu ứng panic nhưng chưa đủ gần để di chuyển
    const warningDistance = 150 + (difficultyLevel * 10);
    const triggerDistance = 100 + (difficultyLevel * 5); // Tăng theo độ khó
    
    if (distance < warningDistance && distance >= triggerDistance) {
        // Thêm hiệu ứng hoảng sợ
        character.classList.remove('idle');
        character.classList.add('panic');
        
        // Xóa hiệu ứng sau một thời gian
        setTimeout(() => {
            character.classList.remove('panic');
            character.classList.add('idle');
        }, 500);
    }
    
    // Nếu chuột quá gần nhân vật, di chuyển nhân vật ra xa chuột
    if (distance < triggerDistance) {
        // Xóa các class hiệu ứng trước khi di chuyển
        character.classList.remove('idle', 'panic', 'taunt');
        
        // Di chuyển ra xa chuột
        const targetX = characterX - dx * 2;
        const targetY = characterY - dy * 2;
        
        // Đảm bảo không ra khỏi giới hạn màn hình
        const safeX = Math.max(safeMargin, Math.min(containerWidth - safeMargin, targetX));
        const safeY = Math.max(safeMargin, Math.min(containerHeight - safeMargin, targetY));
        
        // Di chuyển nhân vật
        character.style.left = safeX + 'px';
        character.style.top = safeY + 'px';
        
        // Cập nhật vị trí
        characterX = safeX;
        characterY = safeY;
        
        // Thêm hiệu ứng di chuyển
        character.classList.add('moving');
        setTimeout(() => {
            character.classList.remove('moving');
            character.classList.add('idle');
        }, 400);
        
        // Phát âm thanh di chuyển nếu không tắt tiếng
        if (!isMuted && Math.random() < 0.3) { // Giảm tần suất phát âm thanh
            playSound(getRandomSound(moveSounds));
        }
    }
}

// Hàm xử lý sự kiện di chuyển chuột đối với nhiều nhân vật
function handleMultipleCharactersMouseMove(e) {
    if (isGameOver) return;
    
    // Lấy vị trí chuột so với gameplay area
    const rect = gameplayArea.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Xử lý nhân vật chính
    handleCharacterMouseMovement(character, mouseX, mouseY, characterX, characterY);
    
    // Lấy danh sách nhân vật phụ
    const extraCharacters = document.querySelectorAll('.extra-character');
    
    // Chỉ xử lý một số nhân vật ngẫu nhiên mỗi lần để giảm lag
    const charsToMove = Math.ceil(extraCharacters.length / 3); // Move 1/3 of characters each time
    const shuffled = Array.from(extraCharacters).sort(() => 0.5 - Math.random());
    
    // Di chuyển các nhân vật được chọn
    shuffled.slice(0, charsToMove).forEach(char => {
        // Lấy vị trí hiện tại của nhân vật phụ
        const charX = parseInt(char.style.left);
        const charY = parseInt(char.style.top);
        
        // Xử lý di chuyển
        handleCharacterMouseMovement(char, mouseX, mouseY, charX, charY);
    });
}

// Helper function to handle individual character movement
function handleCharacterMouseMovement(charElement, mouseX, mouseY, charX, charY) {
    // Tính khoảng cách từ chuột đến nhân vật
    const dx = mouseX - charX;
    const dy = mouseY - charY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Nếu chuột quá gần nhân vật, di chuyển nhân vật ra xa chuột
    const triggerDistance = 100 + (difficultyLevel * 5); // Tăng theo độ khó
    if (distance < triggerDistance) {
        // Tính toán hướng di chuyển
        const angle = Math.atan2(dy, dx);
        
        // Thêm một chút ngẫu nhiên để làm cho chuyển động tự nhiên hơn
        const randomAngle = angle + (Math.random() - 0.5) * 0.5;
        
        // Di chuyển ra xa chuột với tốc độ dựa trên độ khó
        const speed = 100 + (difficultyLevel * 10);
        const targetX = charX - Math.cos(randomAngle) * speed;
        const targetY = charY - Math.sin(randomAngle) * speed;
        
        // Đảm bảo không ra khỏi giới hạn màn hình
        const safeX = Math.max(safeMargin, Math.min(containerWidth - safeMargin, targetX));
        const safeY = Math.max(safeMargin, Math.min(containerHeight - safeMargin, targetY));
        
        // Di chuyển nhân vật
        charElement.style.left = safeX + 'px';
        charElement.style.top = safeY + 'px';
        
        // Cập nhật vị trí (chỉ cho nhân vật chính)
        if (charElement === character) {
            characterX = safeX;
            characterY = safeY;
        }
        
        // Phát âm thanh di chuyển nếu không tắt tiếng (giảm tần suất để tránh quá nhiều âm thanh)
        if (charElement === character && !isMuted && Math.random() < 0.2) {
            playSound(getRandomSound(moveSounds));
        }
    }
}

// Hàm xử lý click chuột
function handleClick(e) {
    // Chỉ xử lý click trong khu vực chơi game
    if (isGameOver) return;
    
    // Lấy vị trí click so với gameplay area
    const rect = gameplayArea.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Kiểm tra xem đã click trúng nhân vật chính hay chưa
    const dx = clickX - characterX;
    const dy = clickY - characterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Nếu click trúng nhân vật
    const hitRadius = 30; // Tăng bán kính va chạm để dễ bắt hơn
    
    if (distance < hitRadius) { // Bán kính va chạm của nhân vật
        // Thêm hiệu ứng click trúng
        const clickEffect = document.createElement('div');
        clickEffect.className = 'click-effect hit';
        clickEffect.style.left = clickX + 'px';
        clickEffect.style.top = clickY + 'px';
        gameplayArea.appendChild(clickEffect);
        
        // Xóa hiệu ứng sau khi animation kết thúc
        setTimeout(() => {
            if (clickEffect.parentNode) {
                clickEffect.parentNode.removeChild(clickEffect);
            }
        }, 500);
        
        catchCharacter();
    } else {
        // Hiệu ứng click hụt
        const clickEffect = document.createElement('div');
        clickEffect.className = 'click-effect miss';
        clickEffect.style.left = clickX + 'px';
        clickEffect.style.top = clickY + 'px';
        gameplayArea.appendChild(clickEffect);
        
        // Xóa hiệu ứng sau khi animation kết thúc
        setTimeout(() => {
            if (clickEffect.parentNode) {
                clickEffect.parentNode.removeChild(clickEffect);
            }
        }, 500);
        
        // Nếu là chế độ đa nhân vật, kiểm tra va chạm với các nhân vật phụ
        if (currentGameMode === 'multi') {
            const extraCharacters = document.querySelectorAll('.extra-character');
            let caught = false;
            
            extraCharacters.forEach((char) => {
                const charRect = char.getBoundingClientRect();
                const charX = charRect.left - rect.left + (charRect.width / 2);
                const charY = charRect.top - rect.top + (charRect.height / 2);
                
                const dx = clickX - charX;
                const dy = clickY - charY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < hitRadius) {
                    // Thay đổi hiệu ứng click thành hit
                    clickEffect.className = 'click-effect hit';
                    
                    catchExtraCharacter(char);
                    caught = true;
                }
            });
            
            // Nếu không bắt được nhân vật nào
            if (!caught) {
                // Hiển thị thông báo "gần trúng" nếu click gần nhân vật
                if (distance < hitRadius * 2) {
                    showNearMissMessage(clickX, clickY);
                }
                
                missClick();
            }
        } else {
            // Hiển thị thông báo "gần trúng" nếu click gần nhân vật
            if (distance < hitRadius * 2) {
                showNearMissMessage(clickX, clickY);
            }
            
            // Các chế độ khác, đơn giản là tăng bộ đếm miss
            missClick();
        }
    }
}

// Hàm hiển thị thông báo gần trúng
function showNearMissMessage(x, y) {
    // Tạo thông báo
    const nearMissMsg = document.createElement('div');
    nearMissMsg.className = 'near-miss-message';
    
    // Chọn thông báo ngẫu nhiên
    const messages = [
        "Gần quá!",
        "Suýt trúng!",
        "Hụt tí!",
        "Gần lắm rồi!",
        "Thiếu chút nữa!"
    ];
    nearMissMsg.textContent = messages[Math.floor(Math.random() * messages.length)];
    
    // Đặt vị trí
    nearMissMsg.style.left = x + 'px';
    nearMissMsg.style.top = y + 'px';
    
    // Thêm vào gameplay area
    gameplayArea.appendChild(nearMissMsg);
    
    // Xóa sau khi animation kết thúc
    setTimeout(() => {
        if (nearMissMsg.parentNode) {
            nearMissMsg.parentNode.removeChild(nearMissMsg);
        }
    }, 1000);
}

// Hàm xử lý khi bắt được nhân vật
function catchCharacter() {
    // Đảm bảo nhân vật tồn tại
    const character = document.querySelector('.character');
    if (!character) return;
    
    // Đánh dấu game đã kết thúc
    isGameOver = true;
    
    // Dừng nhạc nền
    const backgroundMusic = document.getElementById('background-music');
    if (backgroundMusic) {
        backgroundMusic.pause();
    }
    
    // Thêm hiệu ứng bắt được
    character.classList.remove('moving', 'idle', 'taunt', 'panic');
    character.classList.add('caught');
    
    // Xóa các class di chuyển đặc biệt
    character.classList.remove('fast-move', 'crazy-move', 'curve-move', 'mercy-move');
    
    // Phát nhạc chiến thắng
    const victorySound = document.getElementById('victorySound');
    if (victorySound && !isMuted) {
        victorySound.volume = 0.7;
        victorySound.play().catch(e => console.log('Không thể phát âm thanh chiến thắng:', e));
    }
    
    // Hiệu ứng đặc biệt cho nhân vật khi bị bắt
    character.style.transition = 'all 0.5s ease-in-out';
    character.style.transform = 'scale(2) rotate(10deg)';
    
    // Hiệu ứng biến mất
    setTimeout(() => {
        character.style.transform = 'scale(0) rotate(-45deg)';
        character.style.opacity = '0';
        
        // Thêm hiệu ứng flash cho màn hình
        gameplayArea.classList.add('screen-flash');
        setTimeout(() => {
            gameplayArea.classList.remove('screen-flash');
        }, 1000);
    }, 500);
    
    // Hiển thị thông báo chiến thắng
    const victoryPhrase = document.getElementById('victoryMessage');
    if (victoryPhrase) {
        // Chọn thông báo dựa vào số lần nhấp chuột và chế độ chơi
        let message = "";
        
        if (currentGameMode === 'multi') {
            // Thông báo cho chế độ đa nhân vật
            if (missCounter >= 20) {
                message = "Wow! Bạn đã bắt được trong chế độ đa nhân vật sau " + missCounter + " lần nhấp chuột! Thật kiên trì!";
            } else if (missCounter >= 10) {
                message = "Giỏi lắm! Bạn đã bắt được trong chế độ đa nhân vật chỉ với " + missCounter + " lần nhấp chuột!";
            } else {
                message = "Siêu xuất sắc! Bạn đã bắt được trong chế độ đa nhân vật chỉ với " + missCounter + " lần nhấp chuột! Bạn là cao thủ!";
            }
        } else if (currentGameMode === 'crazy') {
            // Thông báo cho chế độ điên cuồng
            if (missCounter >= 15) {
                message = "Cuối cùng cũng bắt được trong chế độ điên cuồng! Thật khó khăn, phải không?";
            } else if (missCounter >= 8) {
                message = "Không tệ! Bạn đã bắt được trong chế độ điên cuồng sau " + missCounter + " lần nhấp chuột!";
            } else {
                message = "Quá đỉnh! Bạn đã bắt được trong chế độ điên cuồng chỉ với " + missCounter + " lần nhấp chuột!";
            }
        } else if (currentGameMode === 'fast') {
            // Thông báo cho chế độ siêu tốc
            if (missCounter >= 12) {
                message = "Bắt được rồi! Chế độ siêu tốc không dễ, phải không?";
            } else if (missCounter >= 6) {
                message = "Phản xạ tốt đấy! Bạn đã bắt được trong chế độ siêu tốc sau " + missCounter + " lần nhấp chuột!";
            } else {
                message = "Phản xạ thần tốc! Bạn đã bắt được trong chế độ siêu tốc chỉ với " + missCounter + " lần nhấp chuột!";
            }
        } else {
            // Thông báo cho chế độ bình thường
            if (missCounter >= 15) {
                message = "Cuối cùng cũng bắt được! Thật khó khăn, phải không?";
            } else if (missCounter >= 10) {
                message = "Bạn đã bắt được sau " + missCounter + " lần nhấp chuột! Không tệ!";
            } else if (missCounter >= 5) {
                message = "Làm tốt lắm! Chỉ mất " + missCounter + " lần nhấp chuột!";
            } else {
                message = "Wow! Siêu lắm! Chỉ mất " + missCounter + " lần nhấp chuột!";
            }
        }
        
        // Thêm thông tin về thời gian chơi nếu có
        if (window.gameStartTime) {
            const gameTime = Math.floor((Date.now() - window.gameStartTime) / 1000);
            message += `<br><span class="time-info">Thời gian: ${gameTime} giây</span>`;
        }
        
        // Hiển thị thông báo
        victoryPhrase.innerHTML = message;
        
        // Hiển thị trong sidebar
        const infoDisplay = document.querySelector('.info-display');
        if (infoDisplay) {
            infoDisplay.style.display = 'block';
            infoDisplay.querySelector('.victory-message').style.display = 'block';
        }
    }
    
    // Hiện nút restart
    setTimeout(() => {
        const restartButton = document.getElementById('restart-game');
        if (restartButton) {
            restartButton.classList.add('highlight');
        }
        
        // Hiển thị nút chơi lại trong khu vực chơi game
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.classList.remove('hidden');
        }
        
        // Dừng mọi event listener để tránh nhấp chuột thêm
        document.removeEventListener('mousemove', handleMouseMove);
        gameplayArea.removeEventListener('click', handleClick);
        
        // Xóa các nhân vật phụ nếu đang chơi chế độ đa nhân vật
        removeMultipleCharacters();
        
        // Hiển thị hiệu ứng confetti nếu số lần click hụt ít
        if (missCounter < 8) {
            showVictoryConfetti();
        }
    }, 1000);
}

// Hàm hiển thị hiệu ứng confetti khi chiến thắng xuất sắc
function showVictoryConfetti() {
    // Tạo 50 phần tử confetti
    for (let i = 0; i < 50; i++) {
        createConfettiElement();
    }
}

// Hàm tạo một phần tử confetti
function createConfettiElement() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    // Màu sắc ngẫu nhiên
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.backgroundColor = randomColor;
    
    // Kích thước ngẫu nhiên
    const size = Math.random() * 10 + 5;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    
    // Vị trí ngẫu nhiên
    const startX = Math.random() * containerWidth;
    confetti.style.left = `${startX}px`;
    confetti.style.top = '-10px';
    
    // Thêm vào gameplay area
    gameplayArea.appendChild(confetti);
    
    // Animation
    const animationDuration = Math.random() * 3 + 2;
    const fallSpeed = Math.random() * 2 + 1;
    
    confetti.style.animation = `fall ${animationDuration}s linear forwards`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    // Xóa sau khi animation kết thúc
    setTimeout(() => {
        if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
        }
    }, animationDuration * 1000);
}

// Hàm xử lý khi click hụt
function missClick() {
    // Tăng bộ đếm
    missCounter++;
    missCount.textContent = missCounter;
    
    // Phát âm thanh miss ngẫu nhiên
    playSound(getRandomSound(missSounds));
    
    // Tăng độ khó sau mỗi 5 lần click hụt (nếu chưa đạt ngưỡng thương hại)
    if (missCounter % 5 === 0 && missCounter < 15) {
        increaseDifficulty();
    }
    
    // Hiển thị thông báo trong sidebar
    showDialog(getRandomPhrase(trollPhrases), 0, 0, 3500, false, 'troll');
    
    // Hiển thị meme khi click hụt, tăng tần suất theo số lần click hụt
    const modeSettings = gameModes[currentGameMode] || gameModes['normal'];
    const memeChance = Math.min(0.8, modeSettings.memeFrequency + (missCounter * 0.05));
    
    // Xử lý hiển thị meme
    if (missCounter >= 20) {
        // Hiển thị nhiều meme cùng lúc nếu click hụt 20+ lần
        if (Math.random() < 0.4) { // Tăng cơ hội hiển thị nhiều meme (40%)
            showMultipleMemes();
        } else if (Math.random() < memeChance) {
            showRandomMeme();
        }
    } else if (Math.random() < memeChance) {
        showRandomMeme();
    }
    
    // Hiển thị meme toàn màn hình tại các cột mốc
    if (missCounter === 10) {
        showFullscreenMeme(7000); // Hiển thị meme toàn màn hình trong 7 giây
    } else if (missCounter === 25) {
        showFullscreenMeme(10000); // Hiển thị meme toàn màn hình trong 10 giây
    }
    
    // Di chuyển nhân vật
    moveToRandomPosition();
}

// Hàm lấy emoji ngẫu nhiên cho nhân vật
function getRandomCharacterEmoji() {
    const randomIndex = Math.floor(Math.random() * characterEmojis.length);
    return characterEmojis[randomIndex];
}

// Hàm tạo vị trí ngẫu nhiên an toàn (tránh góc và viền)
function getRandomSafePosition() {
    // Thêm margin để tránh nhân vật quá gần viền
    const margin = safeMargin;
    
    // Tính toán vị trí ngẫu nhiên nhưng tránh vùng sát viền
    const x = margin + Math.random() * (containerWidth - 50 - margin * 2);
    const y = margin + Math.random() * (containerHeight - 50 - margin * 2);
    
    return { x, y };
}

// Hàm lấy câu thoại ngẫu nhiên từ mảng
function getRandomPhrase(phrases) {
    const randomIndex = Math.floor(Math.random() * phrases.length);
    return phrases[randomIndex];
}

// Hàm phát âm thanh
function playSound(sound) {
    // Nếu đã tắt âm thanh, không phát
    if (isMuted) return;
    
    // Kiểm tra xem trình duyệt có hỗ trợ không
    try {
        sound.currentTime = 0;
        sound.play().catch(error => {
            console.log('Không thể phát âm thanh:', error);
            // Một số trình duyệt yêu cầu tương tác người dùng trước khi phát âm thanh
        });
    } catch (error) {
        console.log('Lỗi phát âm thanh:', error);
    }
}

// Hàm lấy âm thanh ngẫu nhiên từ mảng
function getRandomSound(sounds) {
    const randomIndex = Math.floor(Math.random() * sounds.length);
    return sounds[randomIndex];
}

// Hàm phát nhạc nền
function playBackgroundMusic() {
    try {
        backgroundMusic.volume = 0.3; // Giảm âm lượng xuống 30%
        backgroundMusic.play().catch(error => {
            console.log('Không thể phát nhạc nền:', error);
            // Nhiều trình duyệt yêu cầu tương tác người dùng trước khi phát nhạc
        });
    } catch (error) {
        console.log('Lỗi phát nhạc nền:', error);
    }
}

// Hàm tăng độ khó
function increaseDifficulty() {
    difficultyLevel++;
    
    // Hiển thị thông báo tăng độ khó trong sidebar
    const difficultyPhrase = `Độ khó tăng lên mức ${difficultyLevel}! Tôi sẽ nhanh hơn!`;
    showDialog(difficultyPhrase, 0, 0, 3500, false, 'difficulty');
}

// Hàm cập nhật kích thước màn hình
function updateScreenDimensions() {
    containerWidth = gameplayArea.offsetWidth;
    containerHeight = gameplayArea.offsetHeight;
}

// Hàm hiển thị câu thoại
function showDialog(text, x, y, duration = 3500, useGameplay = true, messageType = 'info') {
    // Nếu useGameplay = true, hiển thị trong khu vực gameplay kiểu cũ
    // Nếu useGameplay = false, hiển thị thông báo nổi bật trong khu vực chơi game
    
    if (useGameplay) {
        // Hiển thị trong khu vực gameplay (cách cũ)
        // Đặt vị trí hộp thoại
        dialogBox.style.left = Math.min(x + 60, containerWidth - 220) + 'px';
        dialogBox.style.top = Math.max(y - 30, 20) + 'px';
        
        // Đặt nội dung
        dialogBox.textContent = text;
        
        // Hiển thị
        dialogBox.classList.remove('hidden');
        dialogBox.classList.add('show');
        
        // Ẩn sau thời gian chỉ định
        setTimeout(() => {
            dialogBox.classList.remove('show');
            setTimeout(() => {
                dialogBox.classList.add('hidden');
            }, 500);
        }, duration);
    } else {
        // Hiển thị thông báo nổi bật trong gameplay
        let notificationIconHTML = '';
        
        switch(messageType) {
            case 'success':
                notificationIconHTML = '<i class="fas fa-check-circle"></i>';
                break;
            case 'warning':
                notificationIconHTML = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            case 'error':
                notificationIconHTML = '<i class="fas fa-times-circle"></i>';
                break;
            case 'troll':
                notificationIconHTML = '<i class="fas fa-laugh-squint"></i>';
                break;
            case 'difficulty':
                notificationIconHTML = '<i class="fas fa-arrow-up"></i>';
                break;
            case 'audio':
                notificationIconHTML = isMuted ? 
                    '<i class="fas fa-volume-mute"></i>' : 
                    '<i class="fas fa-volume-up"></i>';
                break;
            case 'mode':
                notificationIconHTML = '<i class="fas fa-gamepad"></i>';
                break;
            default: // 'info'
                notificationIconHTML = '<i class="fas fa-info-circle"></i>';
                break;
        }
        
        // Cập nhật nội dung thông báo gameplay
        notificationIcon.innerHTML = notificationIconHTML;
        notificationText.textContent = text;
        
        // Xóa tất cả classes thông báo cũ
        gameNotification.classList.remove('notification-info', 'notification-success', 'notification-warning', 
            'notification-error', 'notification-troll', 'notification-difficulty', 'notification-audio', 'notification-mode');
            
        // Thêm class mới
        gameNotification.classList.add('notification-' + messageType);
        
        // Kiểm tra nếu thông báo đã hiển thị, thì chỉ cập nhật nội dung
        const isNotificationVisible = !gameNotification.classList.contains('hidden');
        
        // Thêm hiệu ứng nhấp nháy nếu thông báo đã hiển thị
        if (isNotificationVisible) {
            gameNotification.classList.add('pulse');
            setTimeout(() => {
                gameNotification.classList.remove('pulse');
            }, 500);
        }
        
        // Hiển thị thông báo gameplay
        gameNotification.classList.remove('hidden');
        gameNotification.classList.add('show');
        
        // Ẩn thông báo gameplay sau thời gian chỉ định
        setTimeout(() => {
            gameNotification.classList.remove('show');
            setTimeout(() => {
                gameNotification.classList.add('hidden');
            }, 500);
        }, duration);
    }
}

// Khởi tạo game
function initGame() {
    // Tải trạng thái âm thanh từ localStorage (nếu có)
    const savedMuteState = localStorage.getItem('gameMuted');
    if (savedMuteState !== null) {
        isMuted = savedMuteState === 'true';
        
        // Cập nhật giao diện theo trạng thái âm thanh
        if (isMuted) {
            updateMusicToggleUI(true);
        } else {
            updateMusicToggleUI(false);
        }
    }
    
    // Lưu thời gian bắt đầu chơi
    window.gameStartTime = Date.now();
    
    // Cập nhật kích thước màn hình
    updateScreenDimensions();
    
    // Chọn emoji ngẫu nhiên cho nhân vật chính
    character.textContent = getRandomCharacterEmoji();
    
    // Xóa tất cả các class animation
    character.classList.remove('moving', 'idle', 'taunt', 'panic');
    
    // Thêm hiệu ứng idle cho nhân vật ban đầu
    character.classList.add('idle');
    
    // Đặt nhân vật ở vị trí ngẫu nhiên
    moveToRandomPosition();
    
    // Reset các biến
    missCounter = 0;
    missCount.textContent = '0';
    isGameOver = false;
    difficultyLevel = 1;
    
    // Cập nhật style nhân vật về mặc định
    character.style.fontSize = '50px'; // Reset kích thước emoji
    
    // Ẩn nút chơi lại trong khu vực chơi game
    restartBtn.classList.add('hidden');
    
    // Hiện nhân vật
    character.style.opacity = '1';
    character.classList.remove('caught');
    
    // Bắt các sự kiện
    document.addEventListener('mousemove', handleMouseMove);
    gameplayArea.addEventListener('click', handleClick);
    
    // Xóa các nhân vật phụ nếu đang chơi chế độ đa nhân vật
    removeMultipleCharacters();
    
    // Phát nhạc nền nếu không bị tắt tiếng
    if (!isMuted) {
        playBackgroundMusic();
    }
    
    // Ẩn thông báo chiến thắng nếu đang hiển thị
    const infoDisplay = document.querySelector('.info-display');
    if (infoDisplay) {
        infoDisplay.style.display = 'none';
        const victoryMessage = infoDisplay.querySelector('.victory-message');
        if (victoryMessage) {
            victoryMessage.style.display = 'none';
        }
    }
    
    // Xóa hiệu ứng highlight cho nút chơi lại
    const restartButton = document.getElementById('restart-game');
    if (restartButton) {
        restartButton.classList.remove('highlight');
    }
}

// Khởi tạo khi trang tải xong
window.addEventListener('load', () => {
    // Khởi tạo các sự kiện menu
    initMenuEvents();
    
    // Khởi tạo game
    initGame();
    
    // Thiết lập kiểm tra sức khỏe game định kỳ
    setInterval(checkGameHealth, 5000);
});

// Hàm kiểm tra sức khỏe game
function checkGameHealth() {
    // Không kiểm tra nếu game đã kết thúc
    if (isGameOver) return;
    
    // Kiểm tra xem nhân vật chính có hiển thị không
    if (!isElementVisible(character)) {
        console.log("Phát hiện lỗi: Nhân vật chính không hiển thị!");
        resetCharacterPosition();
        return;
    }
    
    // Kiểm tra xem nhân vật có bị kẹt ở các cạnh không
    const characterLeft = parseInt(character.style.left) || 0;
    const characterTop = parseInt(character.style.top) || 0;
    
    if (characterLeft <= 0 || characterLeft >= containerWidth - 50 ||
        characterTop <= 0 || characterTop >= containerHeight - 50) {
        console.log("Phát hiện lỗi: Nhân vật bị kẹt ở cạnh!");
        resetCharacterPosition();
        return;
    }
    
    // Nếu là chế độ đa nhân vật, kiểm tra các nhân vật phụ
    if (currentGameMode === 'multi') {
        // Kiểm tra số lượng nhân vật phụ
        const extraCharacters = document.querySelectorAll('.extra-character');
        const expectedCount = gameModes['multi'].characterCount - 1;
        
        if (extraCharacters.length < expectedCount) {
            console.log(`Phát hiện lỗi: Thiếu nhân vật phụ! (${extraCharacters.length}/${expectedCount})`);
            
            // Xóa các nhân vật không hợp lệ
            let invalidChars = 0;
            multipleCharacters = multipleCharacters.filter(char => {
                if (!char.element || !isElementVisible(char.element)) {
                    if (char.element && char.element.parentNode) {
                        char.element.remove();
                    }
                    invalidChars++;
                    return false;
                }
                return true;
            });
            
            if (invalidChars > 0) {
                console.log(`Đã xóa ${invalidChars} nhân vật không hợp lệ`);
            }
            
            // Tạo thêm nhân vật để đủ số lượng
            createMultipleCharacters(expectedCount - extraCharacters.length + 1);
        }
    }
}

// Hàm kiểm tra xem phần tử có hiển thị không
function isElementVisible(element) {
    if (!element) return false;
    
    // Kiểm tra xem phần tử có trong DOM không
    if (!element.parentNode) return false;
    
    // Kiểm tra style
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        return false;
    }
    
    return true;
}

// Hàm reset vị trí nhân vật
function resetCharacterPosition() {
    // Đặt lại vị trí nhân vật về trung tâm
    const centerX = containerWidth / 2 - 25;
    const centerY = containerHeight / 2 - 25;
    
    character.style.left = centerX + 'px';
    character.style.top = centerY + 'px';
    
    // Cập nhật biến theo dõi
    characterX = centerX;
    characterY = centerY;
    
    // Reset trạng thái di chuyển
    character.classList.remove('shake', 'jump', 'fast-move', 'crazy-move', 'curve-move', 'mercy-move');
    
    console.log("Đã reset vị trí nhân vật về trung tâm màn hình");
}

// Hàm bật/tắt âm thanh
function toggleAudio() {
    isMuted = !isMuted;
    
    if (isMuted) {
        // Tắt âm thanh
        backgroundMusic.pause();
        
        // Dừng tất cả các âm thanh khác nếu đang phát
        stopAllSounds();
        
        // Cập nhật giao diện
        updateMusicToggleUI(true);
        
        // Hiển thị thông báo
        showDialog("Âm thanh đã tắt!", 0, 0, 2000, false, 'audio');
    } else {
        // Bật âm thanh
        if (!isGameOver) {
            playBackgroundMusic();
        }
        
        // Cập nhật giao diện
        updateMusicToggleUI(false);
        
        // Hiển thị thông báo
        showDialog("Âm thanh đã bật!", 0, 0, 2000, false, 'audio');
        
        // Phát âm thanh để xác nhận
        if (!isGameOver) {
            setTimeout(() => {
                playSound(getRandomSound(missSounds));
            }, 500);
        }
    }
    
    // Lưu trạng thái âm thanh vào localStorage để duy trì giữa các lần chơi
    localStorage.setItem('gameMuted', isMuted.toString());
}

// Cập nhật UI nút âm thanh
function updateMusicToggleUI(muted) {
    if (muted) {
        musicToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i><span>Âm thanh</span>';
        musicToggleBtn.classList.add('muted');
        document.body.classList.add('muted-audio');
    } else {
        musicToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i><span>Âm thanh</span>';
        musicToggleBtn.classList.remove('muted');
        document.body.classList.remove('muted-audio');
    }
}

// Hàm hiển thị meme ngẫu nhiên
function showRandomMeme() {
    // Chọn meme ngẫu nhiên
    const randomMemeIndex = Math.floor(Math.random() * memes.length);
    const memePath = memes[randomMemeIndex];
    
    // Đặt nguồn hình ảnh
    memeImage.src = memePath;
    
    // Đảm bảo hình ảnh tải xong trước khi hiển thị
    memeImage.onload = function() {
        // Hiển thị meme với hiệu ứng
        memeContainer.classList.remove('hidden');
        memeContainer.classList.add('show');
        
        // Ẩn meme sau một khoảng thời gian
        setTimeout(() => {
            memeContainer.classList.remove('show');
            setTimeout(() => {
                memeContainer.classList.add('hidden');
            }, 500);
        }, 2500);
    };
    
    // Xử lý trường hợp lỗi khi tải hình ảnh
    memeImage.onerror = function() {
        console.error("Không thể tải hình ảnh meme: " + memePath);
        // Thử hiển thị một meme khác
        const fallbackIndex = (randomMemeIndex + 1) % memes.length;
        memeImage.src = memes[fallbackIndex];
    };
}

// Hàm hiển thị nhiều meme cùng lúc (chế độ ức chế tối đa)
function showMultipleMemes() {
    // Hiển thị meme chính giữa
    showRandomMeme();
    
    // Hiển thị thêm 2-3 meme nhỏ ở các góc
    setTimeout(() => {
        // Tạo một meme ở góc trên bên phải
        createSmallMeme('top-right');
        
        // Tạo một meme ở góc dưới bên trái
        setTimeout(() => {
            createSmallMeme('bottom-left');
        }, 300);
        
        // 50% cơ hội tạo thêm meme ở góc dưới bên phải
        if (Math.random() < 0.5) {
            setTimeout(() => {
                createSmallMeme('bottom-right');
            }, 600);
        }
    }, 500);
}

// Hàm tạo meme nhỏ ở các góc màn hình
function createSmallMeme(position) {
    // Tạo phần tử meme mới
    const smallMeme = document.createElement('div');
    smallMeme.className = 'small-meme';
    
    // Tạo hình ảnh meme
    const img = document.createElement('img');
    // Chọn meme ngẫu nhiên khác với meme chính
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * memes.length);
    } while (memeImage.src.includes(memes[randomIndex]));
    
    img.src = memes[randomIndex];
    img.alt = 'Small Meme';
    
    // Xử lý lỗi tải hình ảnh
    img.onerror = function() {
        console.error("Không thể tải hình ảnh meme nhỏ: " + img.src);
        // Thử với một meme khác
        img.src = memes[(randomIndex + 1) % memes.length];
    };
    
    // Thêm hình ảnh vào phần tử meme
    smallMeme.appendChild(img);
    
    // Đặt vị trí cho meme
    if (position === 'top-right') {
        smallMeme.style.top = '20px';
        smallMeme.style.right = '20px';
    } else if (position === 'bottom-left') {
        smallMeme.style.bottom = '20px';
        smallMeme.style.left = '20px';
    } else if (position === 'bottom-right') {
        smallMeme.style.bottom = '20px';
        smallMeme.style.right = '20px';
    }
    
    // Thêm meme vào trang
    gameplayArea.appendChild(smallMeme);
    
    // Animation hiển thị
    setTimeout(() => {
        smallMeme.style.opacity = '1';
        smallMeme.style.transform = 'scale(1)';
    }, 10);
    
    // Xóa meme sau một khoảng thời gian
    setTimeout(() => {
        smallMeme.style.opacity = '0';
        smallMeme.style.transform = 'scale(0)';
        setTimeout(() => {
            if (smallMeme.parentNode) {
                smallMeme.remove();
            }
        }, 500);
    }, 2000);
}

// Hàm hiển thị meme toàn màn hình không thể tắt trong một khoảng thời gian
function showFullscreenMeme(duration) {
    // Tạo phần tử overlay toàn màn hình
    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-overlay';
    
    // Tạo phần tử container cho meme
    const memeBox = document.createElement('div');
    memeBox.className = 'fullscreen-meme';
    
    // Tạo hình ảnh meme
    const img = document.createElement('img');
    const randomIndex = Math.floor(Math.random() * memes.length);
    img.src = memes[randomIndex];
    img.alt = 'Fullscreen Meme';
    
    // Xử lý lỗi tải hình ảnh
    img.onerror = function() {
        console.error("Không thể tải hình ảnh meme toàn màn hình: " + img.src);
        // Thử với một meme khác
        img.src = memes[(randomIndex + 1) % memes.length];
    };
    
    // Tạo thông báo
    const message = document.createElement('p');
    message.className = 'fullscreen-message';
    message.textContent = `Meme này sẽ tự động đóng sau ${duration/1000} giây...`;
    
    // Thêm phần tử vào trang
    memeBox.appendChild(img);
    memeBox.appendChild(message);
    overlay.appendChild(memeBox);
    document.body.appendChild(overlay);
    
    // Hiển thị overlay
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
    
    // Cập nhật đếm ngược
    let timeLeft = Math.floor(duration/1000);
    const countdown = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(countdown);
        } else {
            message.textContent = `Meme này sẽ tự động đóng sau ${timeLeft} giây...`;
        }
    }, 1000);
    
    // Ẩn overlay sau thời gian xác định
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 500);
    }, duration);
}

// Hàm để nhân vật khiêu khích người chơi
function tauntPlayer() {
    if (isGameOver) return;
    
    // Xóa các class hiệu ứng khác
    character.classList.remove('idle', 'moving', 'panic');
    
    // Thêm hiệu ứng khiêu khích
    character.classList.add('taunt');
    
    // Phát âm thanh khiêu khích
    if (!isMuted) {
        playSound(getRandomSound(missSounds));
    }
    
    // Chọn một câu nói khiêu khích dựa vào số lần miss
    let tauntPhrase;
    if (missCounter >= 15) {
        tauntPhrase = getRandomPhrase([
            "Quá dễ! 😎 Bạn bắt được tôi không?",
            "Đã click hụt TỚI " + missCounter + " LẦN rồi mà vẫn cố à? 🤣",
            "Chắc tay bạn mỏi lắm rồi hả? 😏",
            "Tôi đứng yên một chút cho bạn bắt đây! KHÔNG! 😜",
            "Bạn THẬT SỰ kém... trong trò này! 😎✌️"
        ]);
    } else {
        tauntPhrase = getRandomPhrase([
            "Quá chậm rồi! 😜",
            "Bạn sẽ không bao giờ bắt được tôi! 😏",
            "Cố gắng lên nào! 😛",
            "Kỹ năng chuột của bạn tệ quá! 🤭"
        ]);
    }
    
    // Hiển thị câu nói khiêu khích
    showDialog(tauntPhrase, characterX, characterY, 2000, true);
    
    // Trở về trạng thái bình thường sau khi khiêu khích
    setTimeout(() => {
        character.classList.remove('taunt');
        character.classList.add('idle');
    }, 2000);
} 
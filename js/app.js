/* ========================================
   像素英语世界 - iPad APP 交互脚本
   ======================================== */

// 全局变量
let currentPage = 'page-home';
let pageHistory = [];
let craftSlot1 = null;
let craftSlot2 = null;
let currentSentenceAnswer = [];
let sentenceSlotsFilled = [null, null, null, null];

// 单词库数据
const wordLibrary = [
    { en: 'fire', cn: '火', category: 'item' },
    { en: 'water', cn: '水', category: 'item' },
    { en: 'light', cn: '光', category: 'item' },
    { en: 'earth', cn: '土', category: 'item' },
    { en: 'wind', cn: '风', category: 'item' },
    { en: 'stone', cn: '石头', category: 'item' },
    { en: 'wood', cn: '木头', category: 'item' },
    { en: 'diamond', cn: '钻石', category: 'item' },
    { en: 'gold', cn: '黄金', category: 'item' },
    { en: 'iron', cn: '铁', category: 'item' },
    { en: 'run', cn: '跑', category: 'action' },
    { en: 'jump', cn: '跳', category: 'action' },
    { en: 'build', cn: '建造', category: 'action' },
    { en: 'mine', cn: '挖矿', category: 'action' },
    { en: 'eat', cn: '吃', category: 'action' },
    { en: 'sleep', cn: '睡觉', category: 'action' },
    { en: 'big', cn: '大的', category: 'feature' },
    { en: 'small', cn: '小的', category: 'feature' },
    { en: 'hot', cn: '热的', category: 'feature' },
    { en: 'cold', cn: '冷的', category: 'feature' },
    { en: 'fast', cn: '快的', category: 'feature' },
    { en: 'slow', cn: '慢的', category: 'feature' },
    { en: 'happy', cn: '开心的', category: 'feature' },
    { en: 'sad', cn: '伤心的', category: 'feature' },
    { en: 'and', cn: '和', category: 'helper' },
    { en: 'the', cn: '这个', category: 'helper' },
    { en: 'a', cn: '一个', category: 'helper' },
    { en: 'is', cn: '是', category: 'helper' },
    { en: 'it', cn: '它', category: 'helper' },
    { en: 'I', cn: '我', category: 'helper' },
];

// 合成配方
const craftingRecipes = {
    'fire+light': { result: 'energy', cn: '能量', explain: '火与光结合产生能量，就像火把照亮黑夜！' },
    'water+fire': { result: 'steam', cn: '蒸汽', explain: '水遇到火变成蒸汽，可以驱动机器！' },
    'earth+water': { result: 'mud', cn: '泥土', explain: '土和水混合变成湿润的泥巴！' },
    'stone+fire': { result: 'lava', cn: '熔岩', explain: '石头被高温融化变成熔岩！' },
    'wood+fire': { result: 'charcoal', cn: '木炭', explain: '木头不完全燃烧变成木炭！' },
    'light+water': { result: 'rainbow', cn: '彩虹', explain: '阳光穿过水滴折射出美丽的彩虹！' },
    'wind+water': { result: 'wave', cn: '波浪', explain: '风吹过水面形成层层波浪！' },
    'earth+wind': { result: 'dust', cn: '灰尘', explain: '风吹起尘土，漫天飞扬！' },
};

// 句子题目
const sentenceQuestions = [
    {
        scene: 'sunny',
        words: ['What', 'a', 'beautiful', 'day'],
        answer: [0, 1, 2, 3],
        cn: '多么美好的一天啊！'
    },
    {
        scene: 'building',
        words: ['I', 'can', 'build', 'house'],
        answer: [0, 1, 2, 3],
        cn: '我会建房子。'
    },
    {
        scene: 'eating',
        words: ['I', 'like', 'to', 'eat'],
        answer: [0, 1, 2, 3],
        cn: '我喜欢吃东西。'
    },
];

let currentSentenceIndex = 0;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initWordLibrary();
    initDragAndDrop();
    initSentenceGame();
});

// ========================================
// 页面导航
// ========================================
function navigateTo(pageId, param) {
    // 记录历史
    pageHistory.push(currentPage);
    
    // 隐藏当前页面
    document.getElementById(currentPage).classList.remove('active');
    
    // 显示新页面
    document.getElementById(pageId).classList.add('active');
    currentPage = pageId;
    
    // 特殊页面初始化
    if (pageId === 'page-craft') {
        resetCrafting();
    } else if (pageId === 'page-sentence') {
        loadSentence(currentSentenceIndex);
    }
    
    // 滚动到顶部
    const page = document.getElementById(pageId);
    if (page) page.scrollTop = 0;
}

function goBack() {
    if (pageHistory.length > 0) {
        const prevPage = pageHistory.pop();
        document.getElementById(currentPage).classList.remove('active');
        document.getElementById(prevPage).classList.add('active');
        currentPage = prevPage;
    }
}

// ========================================
// 设置弹窗
// ========================================
function showSettings() {
    document.getElementById('settingsModal').classList.add('active');
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('active');
}

// ========================================
// 单词详情弹窗
// ========================================
function showWordDetail(en, cn, icon) {
    document.getElementById('detailIcon').textContent = icon;
    document.getElementById('detailWordEn').textContent = en;
    document.getElementById('detailWordCn').textContent = cn;
    document.getElementById('wordDetailModal').classList.add('active');
}

function closeWordDetail() {
    document.getElementById('wordDetailModal').classList.remove('active');
}

// ========================================
// 单词分类页 - 显示模式切换
// ========================================
let displayMode = 'both'; // both, en, cn

function setDisplayMode(mode) {
    displayMode = mode;
    
    // 更新按钮状态
    document.querySelectorAll('.control-bar .ctrl-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (mode === 'cn') {
        document.querySelectorAll('.control-bar .ctrl-btn.green')[0].classList.add('active');
    }
    
    // 更新所有单词卡片显示
    const wordCards = document.querySelectorAll('.word-card');
    wordCards.forEach(card => {
        const enEl = card.querySelector('.word-en');
        const cnEl = card.querySelector('.word-cn');
        
        if (mode === 'cn') {
            enEl.style.display = 'none';
            cnEl.style.display = 'block';
        } else if (mode === 'en') {
            enEl.style.display = 'block';
            cnEl.style.display = 'none';
        } else {
            enEl.style.display = 'block';
            cnEl.style.display = 'block';
        }
    });
}

function startTest() {
    alert('测试模式即将上线，敬请期待！');
}

// ========================================
// 单词合成台
// ========================================
function initWordLibrary() {
    renderWordLibrary(wordLibrary);
}

function renderWordLibrary(words) {
    const grid = document.getElementById('libraryGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    words.forEach(word => {
        const card = document.createElement('div');
        card.className = 'library-word-card';
        card.draggable = true;
        card.dataset.en = word.en;
        card.dataset.cn = word.cn;
        card.dataset.category = word.category;
        card.innerHTML = `
            <span class="en">${word.en}</span>
            <span class="cn">${word.cn}</span>
        `;
        grid.appendChild(card);
    });
    
    // 添加拖拽事件
    initLibraryDrag();
}

function filterWords() {
    const searchTerm = document.getElementById('wordSearch').value.toLowerCase();
    const filtered = wordLibrary.filter(word => 
        word.en.toLowerCase().includes(searchTerm) || 
        word.cn.includes(searchTerm)
    );
    renderWordLibrary(filtered);
}

function filterCategory(category) {
    // 更新标签状态
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (category === 'all') {
        renderWordLibrary(wordLibrary);
    } else {
        const filtered = wordLibrary.filter(word => word.category === category);
        renderWordLibrary(filtered);
    }
}

function initLibraryDrag() {
    const cards = document.querySelectorAll('.library-word-card');
    cards.forEach(card => {
        card.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', JSON.stringify({
                en: this.dataset.en,
                cn: this.dataset.cn
            }));
            this.style.opacity = '0.5';
        });
        
        card.addEventListener('dragend', function() {
            this.style.opacity = '1';
        });
        
        // 点击也可以放入合成槽
        card.addEventListener('click', function() {
            placeWordInSlot({ en: this.dataset.en, cn: this.dataset.cn });
        });
    });
}

function initDragAndDrop() {
    const slots = document.querySelectorAll('.craft-slot');
    
    slots.forEach(slot => {
        slot.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        slot.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        slot.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            try {
                const wordData = JSON.parse(e.dataTransfer.getData('text/plain'));
                const slotNum = this.id === 'slot1' ? 1 : 2;
                setCraftSlot(slotNum, wordData);
            } catch (err) {
                console.error('Drop error:', err);
            }
        });
    });
}

function placeWordInSlot(wordData) {
    // 优先放入空槽
    if (!craftSlot1) {
        setCraftSlot(1, wordData);
    } else if (!craftSlot2) {
        setCraftSlot(2, wordData);
    } else {
        // 两个槽都满了，替换第一个
        setCraftSlot(1, wordData);
    }
}

function setCraftSlot(slotNum, wordData) {
    const slot = document.getElementById(`slot${slotNum}`);
    if (!slot) return;
    
    if (slotNum === 1) {
        craftSlot1 = wordData;
    } else {
        craftSlot2 = wordData;
    }
    
    slot.classList.add('filled');
    slot.innerHTML = `
        <div class="slot-word">
            <span class="en">${wordData.en}</span>
            <span class="cn">${wordData.cn}</span>
        </div>
    `;
    
    // 检查合成按钮状态
    checkCraftButton();
}

function checkCraftButton() {
    const craftBtn = document.getElementById('craftButton');
    if (craftSlot1 && craftSlot2) {
        craftBtn.disabled = false;
    } else {
        craftBtn.disabled = true;
    }
}

function craftWords() {
    if (!craftSlot1 || !craftSlot2) return;
    
    // 生成配方key（顺序无关）
    const key1 = `${craftSlot1.en}+${craftSlot2.en}`;
    const key2 = `${craftSlot2.en}+${craftSlot1.en}`;
    
    const recipe = craftingRecipes[key1] || craftingRecipes[key2];
    
    // 添加历史记录
    addCraftHistory(`${craftSlot1.en} + ${craftSlot2.en} = ?`);
    
    if (recipe) {
        // 合成成功
        showCraftResult(recipe);
    } else {
        // 合成失败
        alert('这两个单词好像不能合成... 试试其他组合吧！');
    }
}

function addCraftHistory(text) {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    const item = document.createElement('div');
    item.className = 'history-item';
    item.textContent = `尝试 ${historyList.children.length + 1}: ${text}`;
    historyList.appendChild(item);
    historyList.scrollTop = historyList.scrollHeight;
}

function showCraftResult(recipe) {
    const modal = document.getElementById('craftResultModal');
    if (!modal) return;
    
    modal.querySelector('.result-en').textContent = recipe.result;
    modal.querySelector('.result-cn').textContent = recipe.cn;
    modal.querySelector('.logic-explain').textContent = recipe.explain;
    
    modal.classList.add('active');
}

function closeCraftResult() {
    document.getElementById('craftResultModal').classList.remove('active');
    resetCrafting();
}

function addToLibrary() {
    // 模拟添加到词库
    alert('🎉 新单词已添加到你的词库！');
    closeCraftResult();
}

function resetCrafting() {
    craftSlot1 = null;
    craftSlot2 = null;
    
    const slot1 = document.getElementById('slot1');
    const slot2 = document.getElementById('slot2');
    
    if (slot1) {
        slot1.classList.remove('filled');
        slot1.innerHTML = '<span class="slot-placeholder">拖入单词</span>';
    }
    if (slot2) {
        slot2.classList.remove('filled');
        slot2.innerHTML = '<span class="slot-placeholder">拖入单词</span>';
    }
    
    checkCraftButton();
}

function switchCraftTab(tab) {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    if (tab === 'daily') {
        // 每日挑战模式
        document.querySelector('.target-word-card').style.display = 'block';
    } else {
        // 自由合成模式
        document.querySelector('.target-word-card').style.display = 'none';
    }
    
    resetCrafting();
}

function showHint() {
    alert('💡 提示：试试把 "fire" 和 "light" 放在一起合成！');
}

// ========================================
// 拼句子游戏
// ========================================
function initSentenceGame() {
    // 初始化单词块拖拽
    initWordBlocksDrag();
    
    // 初始化句子槽拖拽
    initSentenceSlotsDrag();
}

function loadSentence(index) {
    if (index >= sentenceQuestions.length) {
        index = 0;
    }
    
    currentSentenceIndex = index;
    const question = sentenceQuestions[index];
    
    // 更新提示
    document.querySelector('.hint-cn').textContent = question.cn;
    
    // 重置槽位
    sentenceSlotsFilled = [null, null, null, null];
    const slots = document.querySelectorAll('.sentence-slot:not(.end)');
    slots.forEach((slot, i) => {
        slot.className = 'sentence-slot';
        slot.innerHTML = '';
    });
    
    // 重置单词块
    const blocksContainer = document.getElementById('wordBlocks');
    blocksContainer.innerHTML = '';
    
    question.words.forEach((word, i) => {
        const block = document.createElement('div');
        block.className = 'word-block';
        block.draggable = true;
        block.dataset.word = word;
        block.dataset.index = i;
        block.innerHTML = `<span>${word}</span>`;
        
        block.addEventListener('click', function() {
            placeWordToSlot(this);
        });
        
        blocksContainer.appendChild(block);
    });
    
    // 重新初始化拖拽
    initWordBlocksDrag();
}

function initWordBlocksDrag() {
    const blocks = document.querySelectorAll('.word-block');
    blocks.forEach(block => {
        block.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.word);
            e.dataTransfer.setData('index', this.dataset.index);
            this.style.opacity = '0.5';
        });
        
        block.addEventListener('dragend', function() {
            this.style.opacity = '1';
        });
    });
}

function initSentenceSlotsDrag() {
    const slots = document.querySelectorAll('.sentence-slot:not(.end)');
    
    slots.forEach(slot => {
        slot.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.backgroundColor = 'rgba(93, 158, 58, 0.3)';
        });
        
        slot.addEventListener('dragleave', function() {
            this.style.backgroundColor = '';
        });
        
        slot.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '';
            
            const word = e.dataTransfer.getData('text/plain');
            const wordIndex = parseInt(e.dataTransfer.getData('index'));
            const slotPos = parseInt(this.dataset.pos);
            
            placeWordInSentenceSlot(word, wordIndex, slotPos);
        });
    });
}

function placeWordToSlot(block) {
    const word = block.dataset.word;
    const wordIndex = parseInt(block.dataset.index);
    
    // 找第一个空槽
    const emptySlotIndex = sentenceSlotsFilled.findIndex(s => s === null);
    
    if (emptySlotIndex === -1) {
        alert('所有槽位都满了，点击单词可以移除！');
        return;
    }
    
    placeWordInSentenceSlot(word, wordIndex, emptySlotIndex);
}

function placeWordInSentenceSlot(word, wordIndex, slotPos) {
    const slot = document.querySelector(`.sentence-slot[data-pos="${slotPos}"]`);
    if (!slot || slot.classList.contains('end')) return;
    
    // 如果槽位已有单词，先退回
    if (sentenceSlotsFilled[slotPos] !== null) {
        returnWordToPool(sentenceSlotsFilled[slotPos].wordIndex);
    }
    
    // 放入新单词
    sentenceSlotsFilled[slotPos] = { word, wordIndex };
    slot.classList.add('filled');
    slot.innerHTML = `<span>${word}</span>`;
    
    // 标记单词块为已使用
    const wordBlock = document.querySelector(`.word-block[data-index="${wordIndex}"]`);
    if (wordBlock) {
        wordBlock.classList.add('used');
    }
    
    // 添加点击移除事件
    slot.onclick = function() {
        removeWordFromSlot(slotPos);
    };
}

function removeWordFromSlot(slotPos) {
    const slot = document.querySelector(`.sentence-slot[data-pos="${slotPos}"]`);
    if (!slot || !slot.classList.contains('filled')) return;
    
    const wordData = sentenceSlotsFilled[slotPos];
    if (!wordData) return;
    
    // 退回单词池
    returnWordToPool(wordData.wordIndex);
    
    // 清空槽位
    sentenceSlotsFilled[slotPos] = null;
    slot.classList.remove('filled', 'correct', 'wrong');
    slot.innerHTML = '';
    slot.onclick = null;
}

function returnWordToPool(wordIndex) {
    const wordBlock = document.querySelector(`.word-block[data-index="${wordIndex}"]`);
    if (wordBlock) {
        wordBlock.classList.remove('used');
    }
}

function checkSentence() {
    const question = sentenceQuestions[currentSentenceIndex];
    const slots = document.querySelectorAll('.sentence-slot:not(.end)');
    let allCorrect = true;
    let allFilled = true;
    
    slots.forEach((slot, i) => {
        const slotWord = sentenceSlotsFilled[i];
        const correctWordIndex = question.answer[i];
        const correctWord = question.words[correctWordIndex];
        
        if (!slotWord) {
            allFilled = false;
            return;
        }
        
        if (slotWord.word === correctWord) {
            slot.classList.add('correct');
            slot.classList.remove('wrong');
        } else {
            slot.classList.add('wrong');
            slot.classList.remove('correct');
            allCorrect = false;
        }
    });
    
    if (!allFilled) {
        alert('还有空位置哦，把所有单词都放进去吧！');
        return;
    }
    
    if (allCorrect) {
        showSuccess();
    } else {
        setTimeout(() => {
            alert('再想想看，顺序好像不太对哦~ 💭');
            // 清除错误状态
            slots.forEach(slot => {
                slot.classList.remove('wrong');
            });
        }, 500);
    }
}

function showSuccess() {
    document.getElementById('successModal').classList.add('active');
}

function closeSuccess() {
    document.getElementById('successModal').classList.remove('active');
}

function resetSentence() {
    const slots = document.querySelectorAll('.sentence-slot:not(.end)');
    slots.forEach((slot, i) => {
        sentenceSlotsFilled[i] = null;
        slot.className = 'sentence-slot';
        slot.innerHTML = '';
        slot.onclick = null;
    });
    
    const blocks = document.querySelectorAll('.word-block');
    blocks.forEach(block => {
        block.classList.remove('used');
    });
}

function showSentenceHint() {
    const question = sentenceQuestions[currentSentenceIndex];
    
    // 找到第一个空的或错误的位置
    for (let i = 0; i < question.answer.length; i++) {
        const slotWord = sentenceSlotsFilled[i];
        const correctWordIndex = question.answer[i];
        const correctWord = question.words[correctWordIndex];
        
        if (!slotWord || slotWord.word !== correctWord) {
            // 显示提示：高亮正确的单词
            const correctBlock = document.querySelector(`.word-block[data-word="${correctWord}"]`);
            if (correctBlock) {
                correctBlock.style.animation = 'correctPulse 1s ease infinite';
                setTimeout(() => {
                    correctBlock.style.animation = '';
                }, 3000);
            }
            
            // 高亮目标槽位
            const targetSlot = document.querySelector(`.sentence-slot[data-pos="${i}"]`);
            if (targetSlot) {
                targetSlot.style.borderColor = '#FFD700';
                targetSlot.style.boxShadow = '0 0 10px #FFD700';
                setTimeout(() => {
                    targetSlot.style.borderColor = '';
                    targetSlot.style.boxShadow = '';
                }, 3000);
            }
            
            break;
        }
    }
}

function nextSentence() {
    closeSuccess();
    currentSentenceIndex++;
    if (currentSentenceIndex >= sentenceQuestions.length) {
        currentSentenceIndex = 0;
        alert('🎉 恭喜你完成了所有句子练习！太棒了！');
    }
    loadSentence(currentSentenceIndex);
}

// ========================================
// 额外功能
// ========================================

// 点击弹窗外部关闭
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// 键盘事件
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // 关闭所有弹窗
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    if (e.key === 'Enter') {
        if (document.getElementById('craftResultModal').classList.contains('active')) {
            closeCraftResult();
        }
    }
});

// ========================================
// PWA 相关功能
// ========================================

// 关闭添加到主屏幕提示
function closeAddTip() {
    const tip = document.getElementById('addToHomeTip');
    if (tip) {
        tip.style.display = 'none';
        // 记住用户已关闭，7天内不再显示
        localStorage.setItem('addTipDismissed', Date.now());
    }
}

// 检测是否显示添加到主屏幕提示
function showAddToHomeTip() {
    // 检查是否已经关闭过
    const dismissed = localStorage.getItem('addTipDismissed');
    if (dismissed) {
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - parseInt(dismissed) < sevenDays) {
            return; // 7天内不显示
        }
    }
    
    // 检查是否已经是PWA模式运行
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return; // 已经是独立应用模式，不显示
    }
    
    // 检测是否是移动设备
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
        return; // 桌面端不显示
    }
    
    // 显示提示
    const tip = document.getElementById('addToHomeTip');
    if (tip) {
        setTimeout(() => {
            tip.style.display = 'block';
        }, 3000); // 3秒后显示
    }
}

// 页面加载完成后检测
document.addEventListener('DOMContentLoaded', function() {
    showAddToHomeTip();
});

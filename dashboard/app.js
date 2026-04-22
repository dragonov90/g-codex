const playerStatsEl = document.getElementById("playerStats");
const enemyStatsEl = document.getElementById("enemyStats");
const equipmentInfoEl = document.getElementById("equipmentInfo");
const inventoryListEl = document.getElementById("inventoryList");
const shopListEl = document.getElementById("shopList");
const battleLogEl = document.getElementById("battleLog");

const attackBtn = document.getElementById("attackBtn");
const defendBtn = document.getElementById("defendBtn");
const castBtn = document.getElementById("castBtn");
const itemBtn = document.getElementById("itemBtn");
const nextEnemyBtn = document.getElementById("nextEnemyBtn");

const weaponSelect = document.getElementById("weaponSelect");
const shieldSelect = document.getElementById("shieldSelect");
const spellSelect = document.getElementById("spellSelect");
const itemSelect = document.getElementById("itemSelect");

const weapons = [
  { id: "bronze", name: "Bronz Kılıç", min: 6, max: 10, crit: 0.1, price: 0 },
  { id: "steel", name: "Çelik Gladius", min: 9, max: 14, crit: 0.15, price: 60 },
  { id: "myth", name: "Mistik Claymore", min: 12, max: 18, crit: 0.2, price: 120 },
];

const shields = [
  { id: "wood", name: "Ahşap Kalkan", block: 2, price: 0 },
  { id: "iron", name: "Demir Kalkan", block: 4, price: 70 },
  { id: "tower", name: "Kule Kalkan", block: 6, price: 140 },
];

const spells = [
  { id: "fire", name: "Ateş Topu", mana: 18, damage: [14, 24] },
  { id: "ice", name: "Buz Mızrağı", mana: 14, damage: [10, 18], debuff: 2 },
  { id: "heal", name: "Işık Şifası", mana: 16, heal: [12, 20] },
];

const itemCatalog = [
  { id: "smallPotion", name: "Küçük Can İksiri", amount: 25, count: 2, price: 20 },
  { id: "manaPotion", name: "Mana İksiri", mana: 20, count: 1, price: 25 },
  { id: "bomb", name: "Arena Bombası", damage: 22, count: 1, price: 35 },
];

const player = {
  level: 1,
  exp: 0,
  gold: 100,
  maxHp: 120,
  hp: 120,
  maxMana: 70,
  mana: 70,
  defenseBuff: 0,
  ownedWeapons: ["bronze"],
  ownedShields: ["wood"],
  items: structuredClone(itemCatalog),
  weaponId: "bronze",
  shieldId: "wood",
};

let enemy = createEnemy(1);

function createEnemy(level) {
  const hp = 80 + level * 20;
  return {
    name: `Arena Savaşçısı Lv.${level}`,
    hp,
    maxHp: hp,
    minAttack: 8 + level * 2,
    maxAttack: 12 + level * 3,
    armor: 2 + level,
    slowTurns: 0,
  };
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function selectedWeapon() {
  return weapons.find((w) => w.id === player.weaponId);
}

function selectedShield() {
  return shields.find((s) => s.id === player.shieldId);
}

function addLog(message) {
  const li = document.createElement("li");
  li.textContent = message;
  battleLogEl.prepend(li);
}

function renderStats() {
  playerStatsEl.innerHTML = `
    <div class="stat-card">Seviye: ${player.level}</div>
    <div class="stat-card">Can: ${player.hp}/${player.maxHp}</div>
    <div class="stat-card">Mana: ${player.mana}/${player.maxMana}</div>
    <div class="stat-card">Altın: ${player.gold}</div>
    <div class="stat-card">Deneyim: ${player.exp}/100</div>
  `;

  enemyStatsEl.innerHTML = `
    <div class="stat-card">${enemy.name}</div>
    <div class="stat-card">Can: ${enemy.hp}/${enemy.maxHp}</div>
    <div class="stat-card">Zırh: ${enemy.armor}</div>
    <div class="stat-card">Yavaşlatma: ${enemy.slowTurns} tur</div>
  `;

  const weapon = selectedWeapon();
  const shield = selectedShield();
  equipmentInfoEl.innerHTML = `
    <div class="stat-card">Silah: ${weapon.name} (${weapon.min}-${weapon.max})</div>
    <div class="stat-card">Kalkan: ${shield.name} (Blok ${shield.block})</div>
  `;
}

function renderSelectors() {
  weaponSelect.innerHTML = weapons
    .filter((w) => player.ownedWeapons.includes(w.id))
    .map((w) => `<option value="${w.id}" ${player.weaponId === w.id ? "selected" : ""}>${w.name}</option>`)
    .join("");

  shieldSelect.innerHTML = shields
    .filter((s) => player.ownedShields.includes(s.id))
    .map((s) => `<option value="${s.id}" ${player.shieldId === s.id ? "selected" : ""}>${s.name}</option>`)
    .join("");

  spellSelect.innerHTML = spells.map((s) => `<option value="${s.id}">${s.name} (${s.mana} mana)</option>`).join("");

  itemSelect.innerHTML = player.items
    .map((i) => `<option value="${i.id}">${i.name} x${i.count}</option>`)
    .join("");
}

function renderInventory() {
  inventoryListEl.innerHTML = "";
  player.items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `<span>${item.name}</span><strong>x${item.count}</strong>`;
    inventoryListEl.appendChild(row);
  });

  const shopEntries = [
    ...weapons.filter((w) => !player.ownedWeapons.includes(w.id)).map((w) => ({ type: "weapon", ...w })),
    ...shields.filter((s) => !player.ownedShields.includes(s.id)).map((s) => ({ type: "shield", ...s })),
    ...itemCatalog.map((i) => ({ type: "item", ...i })),
  ];

  shopListEl.innerHTML = "";
  shopEntries.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "row";

    const button = document.createElement("button");
    button.textContent = `Satın Al (${entry.price} altın)`;
    button.disabled = player.gold < entry.price;
    button.addEventListener("click", () => buyEntry(entry));

    row.innerHTML = `<span>${entry.name}</span>`;
    row.appendChild(button);
    shopListEl.appendChild(row);
  });
}

function buyEntry(entry) {
  if (player.gold < entry.price) {
    addLog("Yetersiz altın!");
    return;
  }

  player.gold -= entry.price;
  if (entry.type === "weapon") {
    player.ownedWeapons.push(entry.id);
    player.weaponId = entry.id;
    addLog(`${entry.name} satın alındı ve kuşanıldı.`);
  } else if (entry.type === "shield") {
    player.ownedShields.push(entry.id);
    player.shieldId = entry.id;
    addLog(`${entry.name} satın alındı ve takıldı.`);
  } else {
    const item = player.items.find((i) => i.id === entry.id);
    if (item) {
      item.count += 1;
    }
    addLog(`${entry.name} satın alındı.`);
  }

  rerender();
}

function damageEnemy(amount) {
  const mitigated = Math.max(1, amount - enemy.armor);
  enemy.hp = Math.max(0, enemy.hp - mitigated);
  return mitigated;
}

function enemyTurn() {
  if (enemy.hp <= 0) {
    winFight();
    return;
  }

  const shield = selectedShield();
  const slowPenalty = enemy.slowTurns > 0 ? 3 : 0;
  enemy.slowTurns = Math.max(0, enemy.slowTurns - 1);

  const rawDamage = rand(enemy.minAttack - slowPenalty, enemy.maxAttack - slowPenalty);
  const blocked = shield.block + player.defenseBuff;
  player.defenseBuff = 0;

  const dealt = Math.max(1, rawDamage - blocked);
  player.hp = Math.max(0, player.hp - dealt);
  addLog(`Rakip ${dealt} hasar verdi.`);

  if (player.hp <= 0) {
    addLog("Yenildin! Yeni rakip ile tekrar dene.");
    disableCombat(true);
  }

  rerender();
}

function winFight() {
  const rewardGold = 25 + player.level * 8;
  const rewardExp = 35 + player.level * 10;
  player.gold += rewardGold;
  player.exp += rewardExp;
  addLog(`Zafer! +${rewardGold} altın, +${rewardExp} deneyim.`);

  while (player.exp >= 100) {
    player.exp -= 100;
    player.level += 1;
    player.maxHp += 12;
    player.maxMana += 8;
    player.hp = player.maxHp;
    player.mana = player.maxMana;
    addLog(`Seviye atladın! Yeni seviye: ${player.level}`);
  }

  disableCombat(true);
  rerender();
}

function disableCombat(disabled) {
  [attackBtn, defendBtn, castBtn, itemBtn].forEach((btn) => {
    btn.disabled = disabled;
  });
}

function actionAttack() {
  const weapon = selectedWeapon();
  let dmg = rand(weapon.min, weapon.max);
  const crit = Math.random() < weapon.crit;
  if (crit) dmg *= 2;

  const dealt = damageEnemy(dmg);
  addLog(`Saldırın ${dealt} hasar verdi${crit ? " (kritik!)" : ""}.`);
  rerender();
  enemyTurn();
}

function actionDefend() {
  player.defenseBuff = 6;
  addLog("Savunma pozisyonu aldın, bu tur ekstra blok aktif.");
  enemyTurn();
}

function actionCast() {
  const spell = spells.find((s) => s.id === spellSelect.value);
  if (!spell) return;
  if (player.mana < spell.mana) {
    addLog("Yetersiz mana.");
    return;
  }

  player.mana -= spell.mana;

  if (spell.heal) {
    const healValue = rand(spell.heal[0], spell.heal[1]);
    player.hp = Math.min(player.maxHp, player.hp + healValue);
    addLog(`${spell.name} ile ${healValue} can yeniledin.`);
  } else {
    const base = rand(spell.damage[0], spell.damage[1]);
    const dealt = damageEnemy(base);
    addLog(`${spell.name} ${dealt} hasar verdi.`);
    if (spell.debuff) {
      enemy.slowTurns = Math.max(enemy.slowTurns, spell.debuff);
      addLog("Rakip yavaşlatıldı.");
    }
  }

  rerender();
  enemyTurn();
}

function actionUseItem() {
  const item = player.items.find((i) => i.id === itemSelect.value);
  if (!item || item.count <= 0) {
    addLog("Bu eşyadan kalmadı.");
    return;
  }

  item.count -= 1;
  if (item.amount) {
    player.hp = Math.min(player.maxHp, player.hp + item.amount);
    addLog(`${item.name} kullandın, ${item.amount} can kazandın.`);
  }
  if (item.mana) {
    player.mana = Math.min(player.maxMana, player.mana + item.mana);
    addLog(`${item.name} kullandın, ${item.mana} mana kazandın.`);
  }
  if (item.damage) {
    const dealt = damageEnemy(item.damage);
    addLog(`${item.name} patladı, ${dealt} hasar verdi.`);
  }

  rerender();
  enemyTurn();
}

function spawnNextEnemy() {
  enemy = createEnemy(player.level + rand(0, 1));
  disableCombat(false);
  addLog(`${enemy.name} arenaya çıktı!`);
  rerender();
}

function rerender() {
  renderStats();
  renderSelectors();
  renderInventory();
}

weaponSelect.addEventListener("change", (e) => {
  player.weaponId = e.target.value;
  rerender();
});

shieldSelect.addEventListener("change", (e) => {
  player.shieldId = e.target.value;
  rerender();
});

attackBtn.addEventListener("click", actionAttack);
defendBtn.addEventListener("click", actionDefend);
castBtn.addEventListener("click", actionCast);
itemBtn.addEventListener("click", actionUseItem);
nextEnemyBtn.addEventListener("click", spawnNextEnemy);

addLog("Arena hazır. İlk hamleni yap!");
rerender();

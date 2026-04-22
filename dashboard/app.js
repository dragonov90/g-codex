const playerStatsEl = document.getElementById("playerStats");
const enemyStatsEl = document.getElementById("enemyStats");
const equipmentInfoEl = document.getElementById("equipmentInfo");
const battleLogEl = document.getElementById("battleLog");
const arenaStatusEl = document.getElementById("arenaStatus");
const arenaProgressBarEl = document.getElementById("arenaProgressBar");

const attackBtn = document.getElementById("attackBtn");
const defendBtn = document.getElementById("defendBtn");
const castBtn = document.getElementById("castBtn");
const itemBtn = document.getElementById("itemBtn");
const nextEnemyBtn = document.getElementById("nextEnemyBtn");

const spellSelect = document.getElementById("spellSelect");
const itemSelect = document.getElementById("itemSelect");

const swordShopEl = document.getElementById("swordShop");
const armorShopEl = document.getElementById("armorShop");
const orbShopEl = document.getElementById("orbShop");

const swords = [
  { id: "bronze", name: "Bronz Kılıç", power: 9, crit: 0.05, price: 0 },
  { id: "steel", name: "Çelik Kılıç", power: 12, crit: 0.08, price: 110 },
  { id: "obsidian", name: "Obsidyen Kılıç", power: 15, crit: 0.1, price: 260 },
  { id: "royal", name: "Kraliyet Kılıcı", power: 19, crit: 0.12, price: 480 },
  { id: "legend", name: "Efsane Kılıç", power: 24, crit: 0.14, price: 760 },
];

const armors = [
  { id: "leather", name: "Deri Zırh", block: 3, hpBonus: 0, price: 0 },
  { id: "chain", name: "Zincir Zırh", block: 5, hpBonus: 10, price: 130 },
  { id: "plate", name: "Plaka Zırh", block: 7, hpBonus: 24, price: 300 },
  { id: "imperial", name: "İmparator Zırhı", block: 9, hpBonus: 40, price: 540 },
  { id: "aegis", name: "Aegis Zırh", block: 12, hpBonus: 60, price: 820 },
];

const orbs = [
  { id: "ember", name: "Köz Küresi", mana: 14, scale: 1.0, bonus: 5, price: 90 },
  { id: "frost", name: "Buz Küresi", mana: 16, scale: 1.05, bonus: 7, slow: 1, price: 220 },
  { id: "storm", name: "Fırtına Küresi", mana: 20, scale: 1.15, bonus: 9, price: 430 },
  { id: "solar", name: "Güneş Küresi", mana: 24, scale: 1.3, bonus: 12, price: 700 },
];

const spells = [
  { id: "slashRune", name: "Kesik Rünü", type: "damage", base: 10, mana: 10 },
  { id: "regenRune", name: "Yenileme Rünü", type: "heal", base: 16, mana: 14 },
  { id: "focusRune", name: "Odak Rünü", type: "buff", mana: 12, attackBuff: 4 },
];

const items = [
  { id: "hpPotion", name: "Can İksiri", heal: 28, count: 3, price: 35 },
  { id: "manaPotion", name: "Mana İksiri", mana: 22, count: 2, price: 35 },
];

const enemyNames = Array.from({ length: 100 }, (_, i) => `Arena Rakibi #${i + 1}`);

const player = {
  level: 1,
  exp: 0,
  gold: 200,
  baseMaxHp: 140,
  maxHp: 140,
  hp: 140,
  maxMana: 80,
  mana: 80,
  tempDefense: 0,
  tempAttack: 0,
  ownedSwords: ["bronze"],
  ownedArmors: ["leather"],
  ownedOrbs: ["ember"],
  swordId: "bronze",
  armorId: "leather",
  orbId: "ember",
  inventory: structuredClone(items),
};

let enemyIndex = 0;
let enemy = createEnemy(enemyIndex);

function createEnemy(index) {
  const tier = index + 1;
  return {
    name: enemyNames[index],
    hp: 100 + tier * 7,
    maxHp: 100 + tier * 7,
    attack: 11 + Math.floor(tier * 0.7),
    defense: 3 + Math.floor(tier * 0.4),
    slowTurn: 0,
  };
}

function getSword() {
  return swords.find((s) => s.id === player.swordId);
}

function getArmor() {
  return armors.find((a) => a.id === player.armorId);
}

function getOrb() {
  return orbs.find((o) => o.id === player.orbId);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function addLog(text) {
  const li = document.createElement("li");
  li.textContent = text;
  battleLogEl.prepend(li);
}

function balancedAttack(attackerPower, defenderArmor, swing = 0.08) {
  const randomFactor = 1 + (Math.random() * 2 - 1) * swing;
  const raw = attackerPower * randomFactor;
  const mitigated = raw * (100 / (100 + defenderArmor * 6));
  return Math.max(1, Math.round(mitigated));
}

function renderStats() {
  playerStatsEl.innerHTML = `
    <div class="stat-card">Seviye: ${player.level}</div>
    <div class="stat-card">Can: ${player.hp}/${player.maxHp}</div>
    <div class="stat-card">Mana: ${player.mana}/${player.maxMana}</div>
    <div class="stat-card">Altın: ${player.gold}</div>
    <div class="stat-card">XP: ${player.exp}/120</div>
  `;

  enemyStatsEl.innerHTML = `
    <div class="stat-card">${enemy.name}</div>
    <div class="stat-card">Can: ${enemy.hp}/${enemy.maxHp}</div>
    <div class="stat-card">Saldırı: ${enemy.attack}</div>
    <div class="stat-card">Savunma: ${enemy.defense}</div>
  `;

  const sword = getSword();
  const armor = getArmor();
  const orb = getOrb();

  equipmentInfoEl.innerHTML = `
    <div class="stat-card">Kılıç: ${sword.name} (+${sword.power} güç, kritik ${Math.round(sword.crit * 100)}%)</div>
    <div class="stat-card">Zırh: ${armor.name} (+${armor.block} blok, +${armor.hpBonus} can)</div>
    <div class="stat-card">Küre: ${orb.name} (mana ${orb.mana}, büyü çarpanı x${orb.scale})</div>
  `;

  const progress = ((enemyIndex + (enemy.hp <= 0 ? 1 : 0)) / 100) * 100;
  arenaProgressBarEl.style.width = `${clamp(progress, 0, 100)}%`;
  arenaStatusEl.innerHTML = `<strong>${enemyIndex + 1}/100</strong> rakip dövüşü`;
}

function renderSelectors() {
  spellSelect.innerHTML = spells.map((s) => `<option value="${s.id}">${s.name} (${s.mana} mana)</option>`).join("");
  itemSelect.innerHTML = player.inventory.map((i) => `<option value="${i.id}">${i.name} x${i.count}</option>`).join("");
}

function shopRow(item, onBuy, owned) {
  const row = document.createElement("div");
  row.className = "shop-row";

  const left = document.createElement("span");
  left.textContent = `${item.name} - ${item.price} altın`;

  const button = document.createElement("button");
  if (owned) {
    button.textContent = "Kuşan";
  } else {
    button.textContent = "Satın Al";
  }
  button.disabled = !owned && player.gold < item.price;
  button.addEventListener("click", onBuy);

  row.append(left, button);
  return row;
}

function renderShops() {
  swordShopEl.innerHTML = "";
  swords.forEach((sword) => {
    const owned = player.ownedSwords.includes(sword.id);
    swordShopEl.appendChild(
      shopRow(
        sword,
        () => {
          if (!owned) {
            player.gold -= sword.price;
            player.ownedSwords.push(sword.id);
            addLog(`${sword.name} satın alındı.`);
          }
          player.swordId = sword.id;
          addLog(`${sword.name} kuşanıldı.`);
          rerender();
        },
        owned
      )
    );
  });

  armorShopEl.innerHTML = "";
  armors.forEach((armor) => {
    const owned = player.ownedArmors.includes(armor.id);
    armorShopEl.appendChild(
      shopRow(
        armor,
        () => {
          if (!owned) {
            player.gold -= armor.price;
            player.ownedArmors.push(armor.id);
            addLog(`${armor.name} satın alındı.`);
          }
          player.armorId = armor.id;
          recalcMaxHp();
          addLog(`${armor.name} giyildi.`);
          rerender();
        },
        owned
      )
    );
  });

  orbShopEl.innerHTML = "";
  orbs.forEach((orb) => {
    const owned = player.ownedOrbs.includes(orb.id);
    orbShopEl.appendChild(
      shopRow(
        orb,
        () => {
          if (!owned) {
            player.gold -= orb.price;
            player.ownedOrbs.push(orb.id);
            addLog(`${orb.name} satın alındı.`);
          }
          player.orbId = orb.id;
          addLog(`${orb.name} takıldı.`);
          rerender();
        },
        owned
      )
    );
  });
}

function recalcMaxHp() {
  const armor = getArmor();
  const oldMax = player.maxHp;
  player.maxHp = player.baseMaxHp + armor.hpBonus + player.level * 8;
  player.hp = clamp(player.hp + (player.maxHp - oldMax), 1, player.maxHp);
}

function gainRewards() {
  const tier = enemyIndex + 1;
  const goldGain = 28 + tier * 4;
  const expGain = 26 + tier * 3;
  player.gold += goldGain;
  player.exp += expGain;
  addLog(`Kazandın! +${goldGain} altın, +${expGain} XP.`);

  while (player.exp >= 120) {
    player.exp -= 120;
    player.level += 1;
    player.baseMaxHp += 5;
    player.maxMana += 4;
    recalcMaxHp();
    player.hp = player.maxHp;
    player.mana = player.maxMana;
    addLog(`Seviye atladın! (${player.level})`);
  }
}

function enemyTurn() {
  if (enemy.hp <= 0) {
    gainRewards();
    disableCombat(true);
    rerender();
    return;
  }

  const armor = getArmor();
  const slowPenalty = enemy.slowTurn > 0 ? 3 : 0;
  enemy.slowTurn = Math.max(0, enemy.slowTurn - 1);

  const enemyPower = enemy.attack - slowPenalty;
  const blockedArmor = armor.block + player.tempDefense;
  const damage = balancedAttack(enemyPower, blockedArmor);

  player.hp = clamp(player.hp - damage, 0, player.maxHp);
  player.tempDefense = 0;
  addLog(`Rakip ${damage} hasar vurdu.`);

  if (player.hp <= 0) {
    addLog("Yenildin. Aynı rakiple tekrar deneyebilirsin.");
    disableCombat(true);
  }

  rerender();
}

function actionAttack() {
  const sword = getSword();
  const basePower = sword.power + player.level * 2 + player.tempAttack;
  const crit = Math.random() < sword.crit;
  const hitPower = crit ? basePower * 1.45 : basePower;
  const damage = balancedAttack(hitPower, enemy.defense);

  enemy.hp = clamp(enemy.hp - damage, 0, enemy.maxHp);
  addLog(`Saldırı ${damage} hasar verdi${crit ? " (kritik)" : ""}.`);
  player.tempAttack = 0;
  rerender();
  enemyTurn();
}

function actionDefend() {
  player.tempDefense = 8;
  addLog("Savunma açıldı: +8 blok (1 tur). ");
  enemyTurn();
}

function actionCast() {
  const selected = spells.find((s) => s.id === spellSelect.value);
  const orb = getOrb();

  if (!selected) return;
  if (player.mana < selected.mana) {
    addLog("Yetersiz mana.");
    return;
  }

  player.mana -= selected.mana;

  if (selected.type === "damage") {
    const spellPower = (selected.base + player.level * 2 + orb.bonus) * orb.scale;
    const damage = balancedAttack(spellPower, enemy.defense, 0.06);
    enemy.hp = clamp(enemy.hp - damage, 0, enemy.maxHp);
    addLog(`${selected.name} ${damage} hasar verdi.`);
    if (orb.slow) {
      enemy.slowTurn = Math.max(enemy.slowTurn, orb.slow);
      addLog("Küre etkisi: Rakip yavaşladı.");
    }
  }

  if (selected.type === "heal") {
    const heal = Math.round((selected.base + orb.bonus / 2) * orb.scale);
    player.hp = clamp(player.hp + heal, 0, player.maxHp);
    addLog(`${selected.name} ile ${heal} can yeniledin.`);
  }

  if (selected.type === "buff") {
    player.tempAttack = selected.attackBuff + Math.round(orb.bonus / 3);
    addLog(`Bir sonraki saldırıya +${player.tempAttack} güç eklendi.`);
  }

  rerender();
  enemyTurn();
}

function actionUseItem() {
  const chosen = player.inventory.find((i) => i.id === itemSelect.value);
  if (!chosen || chosen.count <= 0) {
    addLog("İksir kalmadı.");
    return;
  }

  chosen.count -= 1;
  if (chosen.heal) {
    player.hp = clamp(player.hp + chosen.heal, 0, player.maxHp);
    addLog(`${chosen.name} kullanıldı: +${chosen.heal} can.`);
  }
  if (chosen.mana) {
    player.mana = clamp(player.mana + chosen.mana, 0, player.maxMana);
    addLog(`${chosen.name} kullanıldı: +${chosen.mana} mana.`);
  }

  rerender();
  enemyTurn();
}

function disableCombat(disabled) {
  [attackBtn, defendBtn, castBtn, itemBtn].forEach((btn) => {
    btn.disabled = disabled;
  });
}

function nextEnemy() {
  if (player.hp <= 0) {
    player.hp = Math.round(player.maxHp * 0.75);
    player.mana = Math.round(player.maxMana * 0.75);
    addLog("Dövüş öncesi toparlandın (%75). ");
  }

  if (enemy.hp > 0 && enemyIndex < 99) {
    addLog("Önce mevcut rakibi bitirmelisin.");
    return;
  }

  if (enemyIndex >= 99 && enemy.hp <= 0) {
    addLog("Tebrikler! 100 rakibin tamamını yendin.");
    nextEnemyBtn.disabled = true;
    return;
  }

  enemyIndex += enemy.hp <= 0 ? 1 : 0;
  enemy = createEnemy(enemyIndex);
  disableCombat(false);
  addLog(`${enemy.name} arenaya çıktı.`);
  rerender();
}

function rerender() {
  renderStats();
  renderSelectors();
  renderShops();
}

attackBtn.addEventListener("click", actionAttack);
defendBtn.addEventListener("click", actionDefend);
castBtn.addEventListener("click", actionCast);
itemBtn.addEventListener("click", actionUseItem);
nextEnemyBtn.addEventListener("click", nextEnemy);

addLog("Arena hazır. 100 rakip seni bekliyor!");
rerender();

import * as fs from "fs";

import * as cheerio from "cheerio"
import axios from 'axios';
import xutil from "xutility";
import _ = require("lodash");


let max__num = 3;
let current_num = 0;
let all_class = [
    {
        name: "死骑",
        en_name: "DeathKnight",
        spec: [
            {name: "鲜血", en_name: "Blood"},
            {name: "冰霜", en_name: "Frost"},
            {name: "邪恶", en_name: "Unholy"},
        ]
    },
    {
        name: "德鲁伊",
        en_name: "Druid",
        spec: [
            {name: "平衡", en_name: "Balance"},
            {name: "野性", en_name: "Feral"},
            {name: "守护", en_name: "Guardian"},
            {name: "恢复", en_name: "Restoration"},
        ]
    },
    {
        name: "猎人",
        en_name: "Hunter",
        spec: [
            {name: "野兽", en_name: "BeastMastery"},
            {name: "射击", en_name: "Marksmanship"},
            {name: "生存", en_name: "Survival"},
        ]
    },
    {
        name: "法师",
        en_name: "Mage",
        spec: [
            {name: "奥术", en_name: "Arcane"},
            {name: "火焰", en_name: "Fire"},
            {name: "冰霜", en_name: "Frost"},
        ]
    },
    {
        name: "圣骑士",
        en_name: "Paladin",
        spec: [
            {name: "神圣", en_name: "Holy"},
            {name: "防护", en_name: "Protection"},
            {name: "惩戒", en_name: "Retribution"},
            {name: "审判", en_name: "Justicar"},
        ],
    },
    {
        name: "牧师",
        en_name: "Priest",
        spec: [
            {name: "戒律", en_name: "Discipline"},
            {name: "神圣", en_name: "Holy"},
            {name: "暗影", en_name: "Shadow"},
        ],
    },
    {
        name: "盗贼",
        en_name: "Rogue",
        spec: [
            {name: "奇袭", en_name: "Assassination"},
            {name: "战斗", en_name: "Combat"},
            {name: "敏锐", en_name: "Subtlety"},
        ],
    },
    {
        name: "萨满",
        en_name: "Shaman",
        spec: [
            {name: "元素", en_name: "Elemental"},
            {name: "增强", en_name: "Enhancement"},
            {name: "恢复", en_name: "Restoration"},
        ],
    },
    {
        name: "术士",
        en_name: "Warlock",
        spec: [
            {name: "痛苦", en_name: "Affliction"},
            {name: "恶魔学识", en_name: "Demonology"},
            {name: "毁灭", en_name: "Destruction"},
        ],
    },
    {
        name: "战士",
        en_name: "Warrior",
        spec: [
            {name: "武器", en_name: "Arms"},
            {name: "狂怒", en_name: "Fury"},
            {name: "防护", en_name: "Protection"},
        ],
    }
];
let word = ["治疗", "恢复", "神圣", "戒律"];

let realm_map = {
    '5083': '比格沃斯',
    '5116': '怒炉',
    '5155': '埃提耶什',
    '5041': '寒脊山小径',
    '5048': '布鲁',
    '5039': '奥罗',
    '5049': '范克瑞斯',
    '5046': '匕首岭',
    '5143': '龙之召唤',
    '5042': '碧玉矿洞',
    '5043': '辛迪加',
    '5044': '哈霍兰',
    '5136': '祈福',
    '5164': '湖畔镇',
    '5139': '奎尔塞拉',
    '5162': '法琳娜',
    '5111': '莫格莱尼',
    '5114': '霜语',
    '5145': '席瓦莱恩',
    '5129': '巨龙追猎者',
    '5085': '帕奇维克',
    '5117': '毁灭之刃',
    '5148': '伦鲁迪洛尔',
    '5122': '震地者',
    '5147': '奥金斧',
    '5105': '娅尔罗',
    '5045': '维希度斯',
    '5113': '德姆塞卡尔',
    '5170': '寒冰之王',
    '5087': '灰烬使者',
    '5109': '艾隆纳亚',
    '5188': '无敌',
    '5119': '诺格弗格',
    '5144': '雷霆之击',
    '5123': '曼多基尔',
    '5134': '维克洛尔',
    '5165': '克罗米',
    '5107': '萨弗拉斯',
    '5118': '觅心者',
    '5104': '卓越',
    '5131': '比斯巨兽',
    '5120': '审判',
    '5137': '末日之刃',
    '5142': '巴罗夫',
    '5160': '范沃森',
    '5157': '火锤',
    '5124': '狮心',
    '5112': '雷德',
    '5115': '无尽风暴',
    '5135': '水晶之牙',
    '5154': '巨人追猎者',
    '5106': '碧空之歌',
    '5133': '安娜丝塔丽',
    '5130': '沙顶 ',
    '5127': '狂野之刃',
    '5150': '厄运之槌',
    '5141': '加丁',
    '5189': '冰封王座',
    '5040': '沙尔图拉',
    '5128': '法尔班克斯',
    '5173': '黑曜石之锋',
    '5152': '怀特迈恩',
    '5146': '秩序之源',
    '5140': '赫洛德',
    '5153': '希尔盖',
    '5138': '维克尼拉斯',
    '5126': '辛洛斯',
    '5169': '龙牙',
    '5132': '灵风',
    '5159': '光芒',
    '5158': '无畏',
    '5110': '骨火'
};


(async () => {

    // let keys = Object.keys(realm_map);
    // console.log(keys.length+"个")
    // for (const key of keys) {
    //
    //     if (!fs.existsSync("realm_" + key + ".lua")) {
    //         console.log(key);
    //     } else {
    //       //  console.log("跳过" + key)
    //     }
    // }

    //  let data = JSON.parse(fs.readFileSync("5115.json").toString())

    ///   await make_lua("5115", data);

    await get_realm(process.argv[2]);

//    await get_all_realm();




})()

// async function get_all_realm() {
//     // let keys = Object.keys(realm_map);
//     // for (const key of keys) {
//     //     if (!fs.existsSync("realm_" + key + ".lua")) {
//     //         await get_realm(key);
//     //     } else {
//     //         console.log("跳过" + key)
//     //     }
//     // }
//     // while (true) {
//     //     let key = keys[Math.floor((Math.random() * keys.length))];
//     //     await get_realm(key);
//     // }
// }

async function get_realm(realm: string) {
    if (!realm_map[realm]) {
        console.log("不存在" + realm + "这个服务器");
        return;
    }


    let data: any = {};

    let promise_list = new Array();

    //竞速公会排行
    promise_list.push(await get_rank(realm, data, "guild_speed", "1506", "Any", "Any", "101125", "speed", "rdps", 10));

    //全明星输出
    promise_list.push(await get_rank(realm, data, "all_start_DPS", "1015", "DPS", "Any", "-1", "dps", "rdps", 10));
    //全明星坦克
    promise_list.push(await get_rank(realm, data, "all_start_Tanks", "1015", "Tanks", "Any", "-1", "dps", "rdps", 10));
    //全明星治疗
    promise_list.push(await get_rank(realm, data, "all_start_Healers", "1015", "Healers", "Any", "-1", "hps", "rdps", 10));

    //具体职业排行
    promise_list.push(get_rank(realm, data, "dps_All", "1506", "All", "All", "101125", "dps", "rdps", 10));
    for (const c of all_class) {
        promise_list.push(get_rank(realm, data, "dps" + c.en_name + "_All", "1506", c.en_name, "All", "101125", "dps", "rdps", 10));
        for (const s of c.spec) {
            promise_list.push(get_rank(realm, data, "dps" + c.en_name + "_" + s.en_name, "1506", c.en_name, s.en_name, "101125", "dps", "rdps", 10));
        }
    }

    promise_list.push(get_rank(realm, data, "hps_All", "1506", "All", "All", "101125", "hps", "rdps", 10));
    for (const c of all_class) {
        // promise_list.push(get_rank(realm, data, "hps" + c.en_name + "_All", "1506", c.en_name, "All", "101125", "hps", "rdps", 10));

        for (const s of c.spec) {
            if (include_word(s.name)) {
                promise_list.push(get_rank(realm, data, "hps" + c.en_name + "_" + s.en_name, "1506", c.en_name, s.en_name, "101125", "hps", "rdps", 10));
            }
        }
    }

    await Promise.all(promise_list);

    await make_lua(realm, data);

    console.log("完成一个");
}

async function make_lua(name, data) {


    let database = "";


    let player_list = new Array();
    let player_map = {};


    function getKeyName(key) {

        switch (key) {
            case  "all_start_DPS":
                return "全明星（DPS）"
                break;
            case  "all_start_Tanks":
                return "全明星（坦克）"
                break;
            case  "all_start_Healers":
                return "全明星（治疗）"
                break;
            case  "dpsDeathKnight_All":
                return "死亡骑士"
                break;
            case  "dps_All":
                return "输出"
                break;
            case  "dpsDruid_All":
                return "德鲁伊"
                break;
            case  "dpsHunter_All":
                return "猎人"
                break;
            case  "dpsMage_All":
                return "法师"
                break;
            case  "dpsPaladin_All":
                return "圣骑士"
                break;
            case  "dpsRogue_All":
                return "盗贼"
                break;
            case  "dpsWarrior_All":
                return "战士"
                break;
            case  "dpsShaman_All":
                return "萨满"
                break;
            case  "dpsPriest_All":
                return "牧师"
                break;
            case  "dpsWarlock_All":
                return "术士"
                break;
            case  "hpsDeathKnight_All":
                return "死亡骑士"
                break;
            case  "hps_All":
                return "治疗"
                break;
            case  "hpsDruid_All":
                return "德鲁伊"
                break;
            case  "hpsHunter_All":
                return "猎人"
                break;
            case  "hpsMage_All":
                return "法师"
                break;
            case  "hpsPaladin_All":
                return "圣骑士"
                break;
            case  "hpsRogue_All":
                return "盗贼"
                break;
            case  "hpsWarrior_All":
                return "战士"
                break;
            case  "hpsShaman_All":
                return "萨满"
                break;
            case  "hpsPriest_All":
                return "牧师"
                break;
            case  "hpsWarlock_All":
                return "术士"
                break;
        }

        let name
        _.find(all_class, function (o) {
            for (const s of o.spec) {
                if ("dps" + o.en_name + "_" + s.en_name == key) {
                    name = o.name + "（" + s.name + "）"
                    return o;
                }
                if ("hps" + o.en_name + "_" + s.en_name == key) {
                    name = o.name + "（" + s.name + "）"
                    return o;
                }
            }
        });

        if (name)
            return name;

        return key;
    }

    function getKeyName2(name) {
        let map = {
            "全明星（DPS）": "全明星（DPS）",
            "全明星（坦克）": "全明星（坦克）",
            "全明星（治疗）": "全明星（治疗）",
            "死亡骑士": "死亡骑士",
            "死骑（鲜血）": "血DK",
            "死骑（冰霜）": "冰DK",
            "死骑（邪恶）": "邪DK",
            "输出": "输出",
            "德鲁伊（平衡）": "平衡德",
            "德鲁伊": "德鲁伊",
            "德鲁伊（野性）": "野德",
            "德鲁伊（守护）": "防德",
            "德鲁伊（恢复）": "恢复德",
            "猎人（野兽）": "兽王猎",
            "猎人（射击）": "射击猎",
            "猎人": "猎人",
            "猎人（生存）": "生存猎",
            "法师（奥术）": "奥法",
            "法师（火焰）": "火法",
            "法师（冰霜）": "冰法",
            "法师": "法师",
            "圣骑士（神圣）": "奶骑",
            "圣骑士（防护）": "防骑",
            "圣骑士（惩戒）": "惩戒骑",
            "圣骑士（审判）": "圣骑士（审判）",
            "圣骑士": "圣骑士",
            "牧师": "牧师",
            "牧师（神圣）": "神圣牧",
            "牧师（戒律）": "戒律牧",
            "牧师（暗影）": "暗牧",
            "盗贼（奇袭）": "奇袭贼",
            "盗贼": "盗贼",
            "盗贼（敏锐）": "敏锐贼",
            "盗贼（战斗）": "战斗贼",
            "萨满（元素）": "元素萨",
            "萨满（增强）": "增强萨",
            "萨满（恢复）": "治疗萨满",
            "萨满": "萨满",
            "术士（痛苦）": "痛苦术",
            "术士": "术士",
            "术士（恶魔学识）": "恶魔术",
            "术士（毁灭）": "毁灭术",
            "战士（武器）": "武器战",
            "战士（狂怒）": "狂暴战",
            "战士（防护）": "防战",
            "战士": "战士",
            "治疗": "治疗"
        }
        if (map[name])
            return map[name]
        return name;
    }

    for (const key of Object.keys(data)) {
        if (key != "guild_speed") {
            for (const v of data[key]) {
                if (!player_list.includes(v.name)) {
                    player_list.push(v.name);
                    player_map[v.name] = new Array();
                }
            }
        }
    }

    for (const name of player_list) {
        for (const key of Object.keys(data)) {
            if (key != "guild_speed") {
                for (const v of data[key]) {
                    if (v.name == name) {
                        let rank: any = {};
                        rank.rank = v.rank;
                        rank.text = "本服第" + rank.rank + getKeyName2(getKeyName(key))
                        if (key.startsWith("all_start")) {
                            rank.text += " 分数:" + v.score
                        } else if (v.type == "dps") {
                            rank.text += " 秒伤:" + v.dps
                        } else {
                            rank.text += " 秒恢复:" + v.dps
                        }


                        if (v.rank <= 10) {
                            rank.text = `|cffff8000${rank.text}|r`;
                        } else if (v.rank <= 50) {
                            rank.text = `|cffa335ee${rank.text}|r`;
                        } else if (v.rank <= 200) {
                            rank.text = `|cff0070ff${rank.text}|r`;
                        } else {
                            rank.text = `|cff666666${rank.text}|r`;
                        }

                        if (v.type == "hps") {
                            if (include_word(getKeyName(key))) {
                                player_map[name].push(rank);
                            }
                        } else {
                            player_map[name].push(rank);
                        }
                    }
                }
            }
        }

        player_map[name] = _.orderBy(player_map[name], ["rank"], ["asc"]);
        let bb = "        [\"" + name + "\"] = {";
        for (let i = 0; i < player_map[name].length; i++) {
            if (player_map[name].length == i + 1 || i == 2) {
                bb += "\"" + player_map[name][i].text + "\""
                break;
            } else {
                bb += "\"" + player_map[name][i].text + "\", "
            }
        }


        bb += "},\n"
        database += bb;
    }


    let guild_speed = "";

    for (const g of data["guild_speed"]) {
        if (g.rank <= 10) {
            let bb = "        [\"" + g.guild + "\"] = \"|cffff8000本服第" + g.rank + "竞速公会 耗时:" + g.speed + "|r\",\n"
            guild_speed += bb;
        } else if (g.rank <= 20) {
            let bb = "        [\"" + g.guild + "\"] = \"|cffa335ee本服第" + g.rank + "竞速公会 耗时:" + g.speed + "|r\",\n"
            guild_speed += bb;
        } else if (g.rank <= 50) {
            let bb = "        [\"" + g.guild + "\"] = \"|cff0070ff本服第" + g.rank + "竞速公会 耗时:" + g.speed + "|r\",\n"
            guild_speed += bb;
        } else {
            let bb = "        [\"" + g.guild + "\"] = \"|cff666666本服第" + g.rank + "竞速公会 耗时:" + g.speed + "|r\",\n"
            guild_speed += bb;
        }
    }

    let str = "if (GetRealmName() == \"" + realm_map[name] + "\") then\n" +
        "    WCLBOX_PLAYER_DATA = {\n" +
        "" + database + "" +
        "    }\n" +
        "    WCLBOX_GUILD_SPEED = {\n" +
        "" + guild_speed + "" +
        "    }\n" +
        "    WCLBOX_UPDATE_TIME=" + (Date.now() / 1000).toFixed(0) + "\n" +
        "end";


    fs.writeFileSync("realm_" + name + ".lua", str);
}

function include_word(text) {
    for (const w of word) {
        if (text.includes(w)) {
            return true;
        }
    }
    return false;
}

async function get_rank(realm: string, data: any, data_name: string, table: string, c: string, spec: string, boss_id: string, dps: string, type: string, page: number) {
    try {
        while (true) {
            if (current_num >= max__num) {
                await xutil.ps.sleep(1000)
            } else {
                current_num++;
                break;
            }
        }
        let array = new Array();
        for (let i = 1; i <= page; i++) {
            console.log(`正在采集 ${realm} ${type} ${c} ${spec} ${i}/${page}`);
            let root;
            while (true) {
                try {
                    let url = "https://cn.warcraftlogs.com/zone/rankings/table/" + table + "/" + dps + "/" + boss_id + "/3/25/1/" + c + "/" + spec + "/0/" + realm + "/0/0/0/?search=&page=" + i + "&affixes=0&faction=0&dpstype=" + type + "&restricted=0";

                    console.log(url);

                    let response = await axios.get(url,
                        {
                            headers: {
                                Referer: url
                            }
                        });


                    root = cheerio.load(response.data);
                    break;
                } catch (e) {
                    console.log("出错了，重新尝试");
                    console.log(e);
                    await xutil.ps.sleep(5000)
                }
            }
            console.log("结果数量:" + root("tr[id]").length);
            if (root("tr[id]").length == 0)
                break;
            if (root("tr[id]").length > 0) {
                for (const p of root("tr[id]").get()) {
                    array.push({
                        class: root(".players-table-spec-icon", p)?.attr("alt")?.trim(),
                        type: dps,
                        realm: root(".players-table-realm", p)?.text()?.trim(),
                        dps: root(".players-table-dps", p)?.text()?.trim(),
                        score: root(".players-table-score", p)?.text()?.trim(),
                        rank: Number(root(".rank", p)?.text()?.trim()),
                        name: root(".main-table-link", p)?.text()?.trim(),
                        guild: root(".main-table-guild", p)?.text()?.trim(),
                        speed: root(".fights-table-duration", p)?.text()?.trim(),
                    })
                }
            }

        }
        data[data_name] = array;
    } finally {
        current_num--;
    }
}


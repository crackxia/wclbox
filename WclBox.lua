local WclBox = {}

-- [插件载入]
local Addon_EventFrame = CreateFrame("Frame")
Addon_EventFrame:RegisterEvent("ADDON_LOADED")
Addon_EventFrame:SetScript("OnEvent", function(self, event, addon)
    if addon == "WclBox" then
        --5秒后再加载，确保是最后hook，这样才能不被其他插件覆盖掉信息
        C_Timer.After(5, function()

            if WCLBOX_PLAYER_DATA then
                print("|cffff8000WclBox已加载成功|r")
            else
                print(
                    "|cffff0000WclBox加载失败，貌似找不到这个服务器的数据，请上NGA原贴反馈~~|r")
            end
            WclBox.hook()
        end)
    end
end)

WclBox.hook = function()
    -- hook角色右键菜单
    hooksecurefunc("UnitPopup_ShowMenu",
                   function(dropdownMenu, which, unit, name, userData)
        local WP_TargetName = dropdownMenu.name

        if UIDROPDOWNMENU_MENU_LEVEL ~= 2 then

            if (which == "SELF" or which == "PLAYER" or which == "PARTY" or
                which == "RAID_PLAYER" or which == "ENEMY_PLAYER" or which ==
                "TARGET" or which == "FOCUS") and UnitIsPlayer(unit) then

                local info = UIDropDownMenu_CreateInfo()
                info.text = '|cFF0099FFWclBox 1.01|r'
                info.owner = which
                info.notCheckable = 1
                info.tooltipOnButton = true
                info.tooltipTitle =
                    '|cffffcf00有问题可上NGA原贴沟通（搜索wclbox）|r'

                UIDropDownMenu_AddSeparator()
                UIDropDownMenu_AddButton(info)
                UIDropDownMenu_AddSeparator()

                local function menu(text)
                    local info2 = UIDropDownMenu_CreateInfo()
                    info2.text = text
                    info2.owner = which
                    info2.notCheckable = 1
                    info2.tooltipOnButton = false
                    UIDropDownMenu_AddButton(info2)
                end

                WclBox.add_menu(WP_TargetName, GetGuildInfo(unit), menu);

                -- add_menu('|cffff8000本服DPS第1术士 8769.5秒伤|r')

                -- add_menu('|cffa335ee本服全明星第15术士 2976.6分|r')

                -- add_menu('|cff0070ff本服全明星第15术士 2976.6分|r')

                -- add_menu('|cff666666本服全明星第15术士 2976.6分|r')

                UIDropDownMenu_AddSeparator()

                menu('更新于：' .. WclBox.getUpdateTime())
            end

        end

    end)

    -- hook右下角tip提示
    GameTooltip:HookScript("OnTooltipSetUnit", function(self)
        local _, unit = self:GetUnit()
        local dstr = ""
        local dstrr = ""
        if UnitExists(unit) and UnitIsPlayer(unit) then
            local unit_name = UnitName(unit)
            GameTooltip:AddLine('------------------------')
            WclBox.add_tip(unit_name, GetGuildInfo(unit), GameTooltip)
            GameTooltip:AddLine('------------------------')
            GameTooltip:AddLine('|cFF0099FFWclBox 1.01|r 更新于：' ..
                                    WclBox.getUpdateTime())
            GameTooltip:Show()

        end
    end)

    hooksecurefunc("ChatFrame_OnHyperlinkShow",
                   function(chatFrame, link, text, button)

        if (link and button) then
            local args = {};
            for v in string.gmatch(link, "[^:]+") do
                table.insert(args, v);
            end

            local menuFrame = CreateFrame("Frame", nil, UIParent,
                                          "UIDropDownMenuTemplate")

            local menu = {}
            if (args[1] and args[1] == "player") then
                args[2] = Ambiguate(args[2], "short")
                local name = args[2]
                WclBox.add_chat_tip(name, null, menu);
                EasyMenu(menu, menuFrame, "cursor", PlayerLinkList:GetWidth(),
                         0, "MENU", 3);
            end
        end

    end)

    -- [公会成员列表热键显示]
    for i = 1, GUILDMEMBERS_TO_DISPLAY do
        _G["GuildFrameButton" .. i]:RegisterForClicks("AnyDown")
        _G["GuildFrameButton" .. i]:HookScript("OnClick", function(self, button)

            local name = _G["GuildFrameButton" .. i .. "Name"]:GetText()

            local menu = {}
            local menuFrame = CreateFrame("Frame", nil, UIParent,
                                          "UIDropDownMenuTemplate")
            WclBox.add_chat_tip(name, GetGuildInfo("player"), menu);
            EasyMenu(menu, menuFrame, "cursor", PlayerLinkList:GetWidth(), 0,
                     "MENU", 3);

        end)
    end

end

WclBox.add_menu = function(name, guild_name, menu)

    local rank1 = WclBox.getRank(name, 1);
    local rank2 = WclBox.getRank(name, 2);
    local rank3 = WclBox.getRank(name, 3);
    local rank3 = WclBox.getRank(name, 3);
    local guild = WclBox.getGuild(guild_name)

    if (rank1) then menu(rank1) end

    if (rank2) then menu(rank2) end

    if (rank3) then menu(rank3) end

    if (guild) then menu(guild) end

    if not rank1 and not rank2 and not rank3 and not guild then
        menu("|cFFff0000这家伙没有任何WCL数据，太惨了~|R")
    end

end

WclBox.add_tip = function(name, guild_name, tip)

    local rank1 = WclBox.getRank(name, 1)
    local rank2 = WclBox.getRank(name, 2)
    local rank3 = WclBox.getRank(name, 3)
    local guild = WclBox.getGuild(guild_name)

    if (rank1) then tip:AddLine(rank1) end

    if (rank2) then tip:AddLine(rank2) end

    if (rank3) then tip:AddLine(rank3) end

    if (guild) then tip:AddLine(guild) end

    if not rank1 and not rank2 and not rank3 and not guild then
        tip:AddLine("|cFFff0000这家伙没有任何WCL数据，太惨了~|R")
    end

end

WclBox.add_chat_tip = function(name, guild_name, menu)

    local rank1 = WclBox.getRank(name, 1)
    local rank2 = WclBox.getRank(name, 2)
    local rank3 = WclBox.getRank(name, 3)
    local guild = WclBox.getGuild(guild_name)

    tinsert(menu, {text = name, notCheckable = true, notClickable = true})
    tinsert(menu, {
        text = "------------------------",
        notCheckable = true,
        notClickable = true
    })
    if (rank1) then
        tinsert(menu, {text = rank1, notCheckable = true, notClickable = true})
    end

    if (rank2) then
        tinsert(menu, {text = rank2, notCheckable = true, notClickable = true})
    end

    if (rank3) then
        tinsert(menu, {text = rank3, notCheckable = true, notClickable = true})
    end

    if (guild) then
        tinsert(menu, {text = guild, notCheckable = true, notClickable = true})
    end

    if not rank1 and not rank2 and not rank3 and not guild then
        tinsert(menu, {
            text = "|cFFff0000这家伙没有任何WCL数据，太惨了~|R",
            notCheckable = true,
            notClickable = true
        })
    end

    tinsert(menu, {
        text = "------------------------",
        notCheckable = true,
        notClickable = true
    })
    tinsert(menu, {
        text = '|cFF0099FFWclBox 1.01|r 更新于：' .. WclBox.getUpdateTime(),
        notCheckable = true,
        notClickable = true
    })

end

WclBox.getRank = function(name, rank)
    if not WCLBOX_PLAYER_DATA or not name or not rank then return end
    if WCLBOX_PLAYER_DATA[tostring(name)] and
        WCLBOX_PLAYER_DATA[tostring(name)][rank] then
        return WCLBOX_PLAYER_DATA[tostring(name)][rank]
    end
end

WclBox.getGuild = function(guild)
    if not WCLBOX_GUILD_SPEED or not guild then return end
    if WCLBOX_GUILD_SPEED[tostring(guild)] then
        return WCLBOX_GUILD_SPEED[tostring(guild)]
    end
end

WclBox.getUpdateTime = function()

    local time = GetServerTime() - (WCLBOX_UPDATE_TIME or 0)

    local time_str =
        "|cffff00001个月以上 (数据太旧，请尽快更新 www.wclbox.com）|r"

    if (time / 86400 < 2) then
        time_str = "|cffff8000" .. (string.format("%.0f", time / 3600)) ..
                       "个小时前|r"
    elseif (time / 86400 < 7) then
        time_str = "|cffa335ee" .. (string.format("%.0f", time / 3600)) ..
                       "个小时前|r"
    elseif (time / 86400 < 15) then
        time_str = "|cff0070ff" .. (string.format("%.0f", time / 3600)) ..
                       "个小时前 (数据太旧，请尽快更新 www.wclbox.com）|r"
    elseif (time / 86400 < 30) then
        time_str = "|cff666666" .. (string.format("%.0f", time / 3600)) ..
                       "个小时前 (数据太旧，请尽快更新 www.wclbox.com）|r"
    end

    return time_str

end

-- 注册聊天窗口命令
SLASH_WCLBOX1 = "/wclbox"
SlashCmdList["WCLBOX"] = function(name)

    print('|cFF0099FFWclBox 1.01  ' .. name .. ' 评分|r')
    print('|cFF0099FF-------------------------|r')

    local rank1 = WclBox.getRank(name, 1)
    local rank2 = WclBox.getRank(name, 2)
    local rank3 = WclBox.getRank(name, 3)
    local guild = WclBox.getGuild(guild_name)

    if (rank1) then print(rank1) end

    if (rank2) then print(rank2) end

    if (rank3) then print(rank3) end

    if (guild) then print(guild) end

    if not rank1 and not rank2 and not rank3 and not guild then
        print("|cFFff0000这家伙没有任何WCL数据，太惨了~|R")
    end
    print('|cFF0099FF-------------------------|r')
end


<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import EmptyState from '@/components/EmptyState.vue'
import { useUserStore } from '@/stores/user'
import { useFavoriteStore, type FavoriteItem, type FavoriteType } from '@/stores/favorite'
import { getTrades, type TradeItem } from '@/api/trade'
import { getLostFounds, type LostFoundItem } from '@/api/lostFound'
import { getGroupBuys, type GroupBuyItem } from '@/api/groupBuy'
import { getErrands, type ErrandItem } from '@/api/errand'

type AnyItem =
  | (TradeItem & { __module: 'trade' })
  | (LostFoundItem & { __module: 'lostfound' })
  | (GroupBuyItem & { __module: 'groupbuy' })
  | (ErrandItem & { __module: 'errand' })

const FALLBACK = {
  trades: [
    { id: 1, title: '九成新机械键盘', category: '数码配件', price: 89, condition: '九成新', location: '东区宿舍', publisher: '软件工程 2023 级学生', publishTime: '2026-06-01 10:20', image: '', status: 'open', description: '键盘使用正常，因更换设备转让。' },
    { id: 2, title: '高等数学教材', category: '教材资料', price: 18, condition: '八成新', location: '图书馆门口', publisher: '数学学院学生', publishTime: '2026-06-01 14:30', image: '', status: 'open', description: '教材有少量笔记，不影响使用。' },
    { id: 3, title: 'iPad Air 5 256G 带笔', category: '电子数码', price: 3299, condition: '九成五新', location: '主校区东门', publisher: '计算机学院 2022 级', publishTime: '2026-06-02 09:15', image: '', status: 'open', description: '带原装充电器和一代 Apple Pencil，屏幕无划痕，带保护壳。' },
    { id: 4, title: '小米电动滑板车 1S', category: '生活用品', price: 899, condition: '八成新', location: '北区自行车棚', publisher: '机械工程学院', publishTime: '2026-06-02 16:40', image: '', status: 'open', description: '续航约 20 公里，毕业出售，校园代步神器。' },
    { id: 5, title: '全新未拆封小米手环 8', category: '数码配件', price: 229, condition: '全新未拆', location: '主校区南门', publisher: '信息学院 2023 级', publishTime: '2026-06-03 12:00', image: '', status: 'open', description: '京东购入，全新未拆封，支持 NFC，原价 279，因生日收了两个转一个。' },
    { id: 6, title: '耐克 Air Force 1 42 码', category: '服饰鞋包', price: 299, condition: '九成新', location: '南区宿舍 3 栋', publisher: '经管学院学生', publishTime: '2026-06-03 20:25', image: '', status: 'open', description: '正品闲置，只穿过 3 次，鞋盒小票齐全。' },
    { id: 7, title: '罗技 G304 无线鼠标', category: '数码配件', price: 119, condition: '九成新', location: '中区宿舍', publisher: '软件工程 2022 级', publishTime: '2026-06-04 09:50', image: '', status: 'open', description: '自用半年，打游戏定位准，续航超长，送全新接收器电池。' },
    { id: 8, title: '线性代数同济第六版', category: '教材资料', price: 12, condition: '七成新', location: '图书馆二楼', publisher: '土木学院学生', publishTime: '2026-06-04 15:20', image: '', status: 'open', description: '有笔记但整理得很清晰，期末必过！送课后习题答案电子版。' },
    { id: 9, title: '小米台灯 Pro', category: '生活用品', price: 79, condition: '八成新', location: '西区 6 栋', publisher: '设计学院学生', publishTime: '2026-06-05 10:10', image: '', status: 'open', description: '护眼台灯，多档亮度色温可调，USB 充电，学习必备。' },
    { id: 10, title: '优衣库纯棉 T 恤 M 码', category: '服饰鞋包', price: 35, condition: '全新未拆', location: '南区 1 栋', publisher: '经管学院 2024 级', publishTime: '2026-06-05 19:30', image: '', status: 'open', description: '买多了一件，白色基础款，百搭不过时，吊牌未拆，原价 99。' },
  ] as TradeItem[],
  lostFounds: [
    { id: 1, title: '寻找黑色校园卡', type: 'lost' as const, itemName: '校园卡', location: '一食堂附近', eventTime: '2026-06-02 12:10', contact: '站内消息联系', status: 'open', description: '校园卡卡套为黑色，内有学生证。' },
    { id: 2, title: '拾到蓝色雨伞', type: 'found' as const, itemName: '雨伞', location: '教学楼 A 区', eventTime: '2026-06-02 18:40', contact: '站内消息联系', status: 'open', description: '雨伞放在 A 区一楼值班室。' },
    { id: 3, title: '寻找银色 AirPods Pro', type: 'lost' as const, itemName: '耳机', location: '图书馆 3 楼自习区', eventTime: '2026-06-03 15:30', contact: '138****5678', status: 'open', description: '白色充电盒有小黄人贴纸，拾到者重金酬谢！' },
    { id: 4, title: '拾到黑色双肩书包', type: 'found' as const, itemName: '书包', location: '体育馆篮球场', eventTime: '2026-06-03 19:00', contact: '站内消息联系', status: 'open', description: '书包内有笔记本和水杯，暂存于体育馆门卫室。' },
    { id: 5, title: '寻找遗失的灰色兔耳伞', type: 'lost' as const, itemName: '雨伞', location: '教学楼 C 栋 5 楼走廊', eventTime: '2026-06-04 08:20', contact: 'QQ 22334455', status: 'open', description: '灰色长柄伞，伞柄有一对兔耳朵装饰，是好朋友送的生日礼物，非常重要！' },
    { id: 6, title: '拾到学生证（计算机学院）', type: 'found' as const, itemName: '学生证', location: '二食堂二楼', eventTime: '2026-06-04 12:45', contact: '站内消息联系', status: 'open', description: '学生证姓名为两个字，计算机学院，请失主带身份验证领取。' },
    { id: 7, title: '寻找粉色保温杯', type: 'lost' as const, itemName: '保温杯', location: '教学楼 B 栋 3 楼教室', eventTime: '2026-06-05 10:30', contact: '站内消息联系', status: 'open', description: '膳魔师粉色保温杯，杯身贴有 LINE FRIENDS 贴纸，对我很重要！' },
    { id: 8, title: '拾到一副黑框眼镜', type: 'found' as const, itemName: '眼镜', location: '图书馆 5 楼角落座位', eventTime: '2026-06-05 21:00', contact: '图书馆服务台', status: 'open', description: '黑框近视眼镜，度数不详，已交图书馆一楼服务台保管。' },
    { id: 9, title: '寻找白色充电宝', type: 'lost' as const, itemName: '充电宝', location: '三食堂或操场看台', eventTime: '2026-06-06 13:00', contact: '微信 wx123456', status: 'open', description: '小米 20000mAh 白色充电宝，有一角摔痕，里面有重要充电线一起丢失。' },
    { id: 10, title: '拾到一串门禁卡', type: 'found' as const, itemName: '门禁卡', location: '实验楼 A 栋大厅', eventTime: '2026-06-06 17:20', contact: '实验楼物业前台', status: 'open', description: '两张实验室门禁卡 + 一张校园卡，已交实验楼前台，请失主前去认领。' },
  ] as LostFoundItem[],
  groupBuys: [
    { id: 1, title: '周五晚火锅拼单', type: '拼餐', targetCount: 6, currentCount: 3, deadline: '2026-06-05 17:00', location: '学校南门', publisher: '计算机学院学生', status: 'open', description: 'AA 制，人数够后统一预约。' },
    { id: 2, title: '四六级资料团购', type: '学习资料', targetCount: 10, currentCount: 7, deadline: '2026-06-06 22:00', location: '线上确认', publisher: '外国语学院学生', status: 'open', description: '达到人数后统一下单。' },
    { id: 3, title: '喜茶满 50 减 20 拼单', type: '拼餐', targetCount: 4, currentCount: 2, deadline: '2026-06-04 15:00', location: '校门口喜茶店', publisher: '经管学院 2024 级', status: 'open', description: '已点 2 杯，还差 2 人，到宿舍楼下分。' },
    { id: 4, title: '毕业照服装租赁团购', type: '生活用品', targetCount: 20, currentCount: 12, deadline: '2026-06-08 18:00', location: '大礼堂门口', publisher: '学生会宣传部', status: 'open', description: '学士服 + 领结/领花，2 天 35 元/套，满 20 人再减 5 元。' },
    { id: 5, title: '美团奶茶 100 减 50 拼单', type: '拼餐', targetCount: 5, currentCount: 2, deadline: '2026-06-05 14:30', location: '中区宿舍楼下分', publisher: '爱喝奶茶的同学', status: 'open', description: '茶百道/古茗/沪上阿姨都可以，凑满 100 减 50，人均超便宜！' },
    { id: 6, title: '端午嘉兴粽子团购', type: '拼餐', targetCount: 30, currentCount: 18, deadline: '2026-06-09 12:00', location: '各宿舍区分发', publisher: '生活部端午活动', status: 'open', description: '鲜肉粽 + 豆沙粽 + 蜜枣粽，10 只装原价 60 现 39.9，含保温箱配送。' },
    { id: 7, title: '山姆会员店瑞士卷拼单', type: '拼餐', targetCount: 4, currentCount: 1, deadline: '2026-06-07 10:00', location: '校内小北门自提', publisher: '食品学院学生', status: 'open', description: '山姆 1.2kg 原味+伯爵茶瑞士卷，一份 16 块太多吃不完，拼每人 4 块 28 元。' },
    { id: 8, title: '考研政治全家桶团购', type: '学习资料', targetCount: 25, currentCount: 11, deadline: '2026-06-10 20:00', location: '宿舍楼下分发', publisher: '考研互助群', status: 'open', description: '肖秀荣 1000 题 + 精讲精练 + 肖四肖八，市场价 268，满 25 人团价 169，正版速发。' },
    { id: 9, title: '校园卡手机 NFC 贴团购', type: '生活用品', targetCount: 50, currentCount: 33, deadline: '2026-06-12 12:00', location: '统一到宿舍派送', publisher: '信息学院技术部', status: 'open', description: '超薄 NFC 贴片，手机背贴即可刷校园卡，测试完美兼容，单张 15 元，满 50 张 9.9。' },
    { id: 10, title: '密室逃脱毕业季团拼', type: '拼玩', targetCount: 8, currentCount: 5, deadline: '2026-06-10 18:00', location: '东门 X 次元密室', publisher: '毕业生活动小组', status: 'open', description: '网红恐怖主题「返校」，8 人开场满员更便宜，人均 78，包送饮料零食。' },
  ] as GroupBuyItem[],
  errands: [
    { id: 1, title: '帮取快递到宿舍楼下', taskType: '取快递', reward: 3, from: '菜鸟驿站', to: '西区 5 栋', deadline: '2026-06-03 19:00', publisher: '西区学生', status: 'open', description: '快递较轻，送到宿舍楼下即可。' },
    { id: 2, title: '帮买一份晚餐', taskType: '代买', reward: 5, from: '二食堂', to: '实验楼 302', deadline: '2026-06-03 18:30', publisher: '实验室学生', status: 'open', description: '需要在 18:30 前送到。' },
    { id: 3, title: '代排队图书馆占座 1 个', taskType: '代排队', reward: 6, from: '图书馆二楼门口', to: '图书馆三楼靠窗位', deadline: '2026-06-04 07:40', publisher: '考研党', status: 'open', description: '明早 7:40 前帮占 1 个靠窗座位，放书包即可。' },
    { id: 4, title: '东区到北区代送文件袋', taskType: '代送', reward: 4, from: '东区 2 栋 301', to: '北区行政楼 208', deadline: '2026-06-04 10:30', publisher: '行政办公室助理', status: 'open', description: '文件袋轻便，需签到领取，请 10:30 前送达。' },
    { id: 5, title: '帮忙打印 10 页论文到教室', taskType: '代办', reward: 5, from: '图书馆打印店', to: '教学楼 A305', deadline: '2026-06-04 13:50', publisher: '赶课的毕业党', status: 'open', description: '已经上传文件到打印店了，付完钱取出来送到教室，下午有答辩要用到！' },
    { id: 6, title: '帮从快递站搬大件到宿舍', taskType: '取快递', reward: 15, from: '京东派快递站', to: '中区 7 栋 6 楼', deadline: '2026-06-05 20:00', publisher: '中区学生', status: 'open', description: '洗衣机包装箱（10kg 左右），到 6 楼，男生优先，含矿泉水一瓶！' },
    { id: 7, title: '代取中药并送到校医院', taskType: '代办', reward: 10, from: '南门同仁堂', to: '校医院三楼护士站', deadline: '2026-06-06 11:00', publisher: '在校住院同学', status: 'open', description: '已预约好只需凭手机号取药，中药已付款，送护士站即可，万分感谢！' },
    { id: 8, title: '帮买三食堂早餐', taskType: '代买', reward: 3, from: '三食堂一楼', to: '西区 2 栋 502', deadline: '2026-06-07 07:50', publisher: '早八赶课学生', status: 'open', description: '2 个肉包子 + 1 杯豆浆（温），费用另算，7:50 前放门口就行。' },
    { id: 9, title: '代取顺丰冷链快递', taskType: '取快递', reward: 6, from: '西门顺丰营业点', to: '北区 11 栋 312', deadline: '2026-06-07 15:00', publisher: '北区学生', status: 'open', description: '生鲜冷链快递，务必 15:00 营业点下班前去取，可提供取件码，感谢！' },
    { id: 10, title: '周末代喂宿舍仓鼠一只', taskType: '代办', reward: 20, from: '南区 8 栋 403', to: '同宿舍', deadline: '2026-06-08 19:00 到 6月9日', publisher: '回家过端午的同学', status: 'open', description: '两天喂食换水就行，鼠鼠很乖不咬人，食物和说明都备好，可进门用备用钥匙。' },
  ] as ErrandItem[],
}

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const favoriteStore = useFavoriteStore()

const productIdNum = computed(() => Number(route.params.id))
const loading = ref(false)
const error = ref('')
const fallbackMode = ref(false)
const item = ref<AnyItem | null>(null)

const moduleLabelMap: Record<AnyItem['__module'], { label: string; icon: string; path: string }> = {
  trade: { label: '二手交易', icon: '🛒', path: '/trade' },
  lostfound: { label: '失物招领', icon: '🔍', path: '/lostfound' },
  groupbuy: { label: '拼单搭子', icon: '👥', path: '/groupbuy' },
  errand: { label: '跑腿委托', icon: '🏃', path: '/errand' },
}

const pathToModule: Record<string, AnyItem['__module']> = {
  '/trade': 'trade',
  '/lostfound': 'lostfound',
  '/groupbuy': 'groupbuy',
  '/errand': 'errand',
}

const moduleToFavType: Record<AnyItem['__module'], FavoriteType> = {
  trade: 'trade',
  lostfound: 'lostFound',
  groupbuy: 'groupBuy',
  errand: 'errand',
}

function buildFallbackAll(): AnyItem[] {
  return [
    ...FALLBACK.trades.map((i) => ({ ...i, __module: 'trade' as const })),
    ...FALLBACK.lostFounds.map((i) => ({ ...i, __module: 'lostfound' as const })),
    ...FALLBACK.groupBuys.map((i) => ({ ...i, __module: 'groupbuy' as const })),
    ...FALLBACK.errands.map((i) => ({ ...i, __module: 'errand' as const })),
  ]
}

function findItemSmart(all: AnyItem[], fromQuery: unknown, id: number): AnyItem | null {
  const mod = typeof fromQuery === 'string' ? pathToModule[fromQuery] : undefined
  if (mod) {
    const byMod = all.find((i) => i.__module === mod && i.id === id)
    if (byMod) return byMod
  }
  return all.find((i) => i.id === id) ?? null
}

const MOCK_MISSING_IDS = new Set([5])

async function loadItem() {
  loading.value = true
  error.value = ''
  item.value = null
  fallbackMode.value = false
  const from = route.query.from

  if (MOCK_MISSING_IDS.has(productIdNum.value)) {
    loading.value = false
    error.value = `ID「${route.params.id}」对应的内容不存在或已下架`
    return
  }

  let found: AnyItem | null = null
  let apiSucceeded = false

  try {
    const [trades, lostFounds, groupBuys, errands] = await Promise.all([
      getTrades().then((r) => r.data.map((i) => ({ ...i, __module: 'trade' as const }))),
      getLostFounds().then((r) => r.data.map((i) => ({ ...i, __module: 'lostfound' as const }))),
      getGroupBuys().then((r) => r.data.map((i) => ({ ...i, __module: 'groupbuy' as const }))),
      getErrands().then((r) => r.data.map((i) => ({ ...i, __module: 'errand' as const }))),
    ])
    apiSucceeded = true
    const all = [...trades, ...lostFounds, ...groupBuys, ...errands]
    found = findItemSmart(all, from, productIdNum.value)
    if (found) {
      item.value = found
    }
  } catch (e) {
    console.warn('[Detail] API 请求失败，降级使用本地 fallback 数据：', e)
    fallbackMode.value = true
  }

  if (!item.value) {
    const fallbackAll = buildFallbackAll()
    const fallbackFound = findItemSmart(fallbackAll, from, productIdNum.value)
    if (fallbackFound) {
      item.value = fallbackFound
      if (!apiSucceeded) fallbackMode.value = true
    } else {
      if (!apiSucceeded) {
        error.value = `ID「${route.params.id}」不存在（Mock 服务未启动且本地数据库中也没有该 ID）`
      } else {
        error.value = `ID「${route.params.id}」对应的内容不存在或已下架`
      }
    }
  }

  loading.value = false
}

onMounted(loadItem)
watch(() => route.params.id, loadItem)

const moduleInfo = computed(() => (item.value ? moduleLabelMap[item.value.__module] : null))
const detailFavType = computed<FavoriteType | null>(() =>
  item.value ? moduleToFavType[item.value.__module] : null,
)
const isFavored = computed(() =>
  item.value && detailFavType.value
    ? favoriteStore.isFavorite(detailFavType.value, item.value.id)
    : false,
)
const fromList = computed(() => {
  if (route.query.from) return route.query.from as string
  return moduleInfo.value?.path ?? '/home'
})
const favoriteItemForStore = computed<FavoriteItem | null>(() => {
  if (!item.value || !detailFavType.value) return null
  const loc =
    'location' in item.value
      ? item.value.location
      : 'from' in item.value
        ? item.value.from
        : '主校区'
  return {
    type: detailFavType.value,
    id: item.value.id,
    title: item.value.title,
    description: item.value.description,
    location: loc,
  }
})

const toastMsg = ref('')
const toastType = ref<'success' | 'info' | 'warn'>('info')
let toastTimer: number | null = null
function showToast(msg: string, type: 'success' | 'info' | 'warn' = 'info') {
  toastMsg.value = msg
  toastType.value = type
  if (toastTimer) window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toastMsg.value = ''
  }, 2200)
}

function handleToggleFav() {
  if (!item.value || !favoriteItemForStore.value) return
  if (!userStore.user.isLoggedIn) {
    showToast('请先登录后再收藏哦～', 'warn')
    setTimeout(() => {
      router.push({
        path: '/login',
        query: { redirect: `/detail/${item.value!.id}` },
      })
    }, 800)
    return
  }
  const r = favoriteStore.toggleFavorite(favoriteItemForStore.value)
  showToast(r.msg, r.ok ? 'success' : 'warn')
}

function contactPublisher() {
  if (!userStore.user.isLoggedIn) {
    showToast('请先登录再联系发布者哦～', 'warn')
    setTimeout(() => {
      router.push({
        path: '/login',
        query: { redirect: `/detail/${productIdNum.value}` },
      })
    }, 800)
    return
  }
  router.push('/message')
}

function getInfoCells(): { label: string; value: string | number; tone?: 'green' | 'warn' | 'price' }[] {
  if (!item.value) return []
  const it = item.value
  const base = [
    { label: '所在校区', value: '🏫 主校区（东区）' },
    { label: '信用状态', value: '✅ 已认证 · 信用 98', tone: 'green' as const },
  ] as { label: string; value: string | number; tone?: 'green' | 'warn' | 'price' }[]

  if (it.__module === 'trade') {
    return [
      { label: '发布人', value: `👤 ${it.publisher}` },
      { label: '物品成色', value: it.condition },
      { label: '交易地点', value: `📍 ${it.location}` },
      { label: '发布时间', value: `📅 ${it.publishTime}` },
      ...base,
    ]
  }
  if (it.__module === 'lostfound') {
    return [
      { label: '物品名称', value: it.itemName },
      { label: '类型', value: it.type === 'lost' ? '🆘 寻物启事' : '📢 失物招领' },
      { label: '事件地点', value: `📍 ${it.location}` },
      { label: '事件时间', value: `⏰ ${it.eventTime}` },
      { label: '联系方式', value: it.contact },
      { label: '发布时间', value: `📅 2026-06-02 18:00` },
      ...base,
    ]
  }
  if (it.__module === 'groupbuy') {
    const pct = Math.min(100, Math.round((it.currentCount / it.targetCount) * 100))
    return [
      { label: '发布人', value: `👤 ${it.publisher}` },
      { label: '拼单类型', value: it.type },
      { label: '拼单地点', value: `📍 ${it.location}` },
      { label: '截止时间', value: `⏰ ${it.deadline}`, tone: 'warn' as const },
      { label: '成团进度', value: `${it.currentCount}/${it.targetCount}人（${pct}%）` },
      { label: '发布时间', value: `📅 2026-06-02 09:30` },
      ...base,
    ]
  }
  return [
    { label: '发布人', value: `👤 ${it.publisher}` },
    { label: '任务类型', value: it.taskType },
    { label: '取件地点', value: `📍 ${it.from}` },
    { label: '送达地点', value: `🏠 ${it.to}` },
    { label: '截止时间', value: `⏰ ${it.deadline}`, tone: 'warn' as const },
    { label: '发布时间', value: `📅 2026-06-02 16:40` },
    ...base,
  ]
}

const infoCells = computed(() => getInfoCells())
</script>

<template>
  <div class="detail-page">
    <div class="breadcrumb">
      <button class="back-btn" @click="router.push(fromList)">← 返回列表</button>
      <span class="crumb-text">
        <span @click="router.push('/home')" class="crumb-link">首页</span>
        <span class="sep">/</span>
        <span v-if="moduleInfo" @click="router.push(moduleInfo.path)" class="crumb-link">
          {{ moduleInfo.icon }} {{ moduleInfo.label }}
        </span>
        <span class="sep">/</span>
        <span class="current">{{ item ? item.title : loading ? '加载中...' : '内容不存在' }}</span>
      </span>
    </div>

    <div v-if="toastMsg" class="toast" :class="toastType">{{ toastMsg }}</div>

    <div v-if="loading" class="state state--loading">
      <div class="spinner" />
      正在加载详情...
    </div>

    <EmptyState v-else-if="error && !item" icon="🔍" :text="error">
      <button class="btn btn-primary" @click="router.push(fromList)">去逛逛其他内容</button>
    </EmptyState>

    <div v-else-if="item" class="detail-card">
      <div class="card-header">
        <div>
          <span v-if="moduleInfo" class="cat-tag">{{ moduleInfo.icon }} {{ moduleInfo.label }}</span>
          <span v-if="item.__module === 'trade'" class="cond-tag">{{ item.condition }}</span>
          <span
            v-else-if="item.__module === 'lostfound'"
            class="cond-tag"
            :class="item.type === 'lost' ? 'tag-lost' : 'tag-found'"
          >
            {{ item.type === 'lost' ? '🆘 寻物' : '📢 招领' }}
          </span>
          <span v-else-if="item.__module === 'groupbuy'" class="cond-tag tag-group">{{ item.type }}</span>
          <span v-else class="cond-tag tag-errand">{{ item.taskType }}</span>
          <span class="id-tag">ID: #{{ String(item.id).padStart(4, '0') }}</span>
        </div>
        <button class="fav-btn-lg" :class="{ favored: isFavored }" @click="handleToggleFav">
          {{ isFavored ? '❤️ 已收藏' : '🤍 收藏' }}
        </button>
      </div>

      <h1 class="product-title">{{ item.title }}</h1>

      <div v-if="item.__module === 'trade'" class="price-line">
        <span class="price-symbol">¥</span>
        <span class="price-num">{{ item.price }}</span>
        <span class="price-tip">校园自提 · 面交更安心</span>
      </div>
      <div v-else-if="item.__module === 'errand'" class="price-line">
        <span class="price-symbol">酬劳 ¥</span>
        <span class="price-num">{{ item.reward }}</span>
        <span class="price-tip">完成任务后可获得</span>
      </div>
      <div v-else-if="item.__module === 'groupbuy'" class="group-line">
        <div class="group-info">
          <span class="group-current">{{ item.currentCount }}</span>
          <span class="group-sep">/</span>
          <span class="group-target">{{ item.targetCount }}人</span>
          <span class="group-tip">还差 {{ Math.max(0, item.targetCount - item.currentCount) }} 人成团</span>
        </div>
        <div class="progress">
          <div class="progress-bar" :style="{ width: Math.min(100, (item.currentCount / item.targetCount) * 100) + '%' }" />
        </div>
      </div>
      <div v-else class="meta-line">
        <span>📍 {{ item.location }}</span>
        <span>⏰ {{ item.eventTime }}</span>
      </div>

      <div class="desc-section">
        <h3 class="section-title">📝 详情描述</h3>
        <p class="desc-text">{{ item.description }}</p>
      </div>

      <div class="info-grid">
        <div v-for="(cell, idx) in infoCells" :key="idx" class="info-cell">
          <div class="label">{{ cell.label }}</div>
          <div class="value" :class="cell.tone">{{ cell.value }}</div>
        </div>
      </div>

      <div class="action-row">
        <button class="btn btn-contact" @click="contactPublisher">💬 联系发布者</button>
        <button class="btn btn-fav-ghost" :class="{ favored: isFavored }" @click="handleToggleFav">
          {{ isFavored ? '💔 取消收藏' : '⭐ 加入收藏夹' }}
        </button>
      </div>

      <div class="tips-box">
        <p class="tips-title">💡 校园集市使用提示</p>
        <ul class="tips-list">
          <li>建议选择校内公共场所面交/对接，确保安全</li>
          <li>当面确认物品与需求后再付款，避免纠纷</li>
          <li>如遇可疑信息，可通过「消息」页举报</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.state {
  padding: 60px 20px;
  text-align: center;
  background: #fff;
  border: 1px dashed #dcdfe6;
  border-radius: 14px;
  color: #909399;
}
.state--loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #d9ecff;
  border-top-color: #409eff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 14px 20px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
}
.back-btn {
  padding: 8px 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: 0.15s;
  font-family: inherit;
  flex-shrink: 0;
}
.back-btn:hover {
  background: #ecf5ff;
  color: #409eff;
  border-color: #b3d8ff;
}
.crumb-text {
  font-size: 14px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.crumb-link {
  cursor: pointer;
  transition: 0.15s;
}
.crumb-link:hover {
  color: #409eff;
}
.sep { color: #c0c4cc; }
.current {
  color: #303133;
  font-weight: 500;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.toast {
  align-self: center;
  padding: 10px 22px;
  border-radius: 999px;
  background: #303133;
  color: #fff;
  font-size: 14px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  animation: toastIn 0.2s ease-out;
}
.toast.success { background: linear-gradient(135deg, #67c23a, #85ce61); }
.toast.warn { background: linear-gradient(135deg, #e6a23c, #f0c78a); }
@keyframes toastIn {
  from { transform: translateY(-8px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.detail-card {
  background: #fff;
  border: 1px solid #e8ecf2;
  border-radius: 14px;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
}
.cat-tag {
  padding: 4px 12px;
  background: #ecf5ff;
  color: #409eff;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  margin-right: 10px;
}
.cond-tag {
  padding: 4px 12px;
  background: #f4f4f5;
  color: #606266;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  margin-right: 10px;
}
.tag-lost { background: #fef0f0; color: #f56c6c; }
.tag-found { background: #f0f9eb; color: #67c23a; }
.tag-group { background: #fdf6ec; color: #e6a23c; }
.tag-errand { background: #f4f4fb; color: #9b59b6; }
.id-tag {
  padding: 4px 12px;
  background: #f4f4f5;
  color: #909399;
  border-radius: 999px;
  font-size: 12px;
  font-family: Consolas, monospace;
}
.fav-btn-lg {
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid #ebeef5;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}
.fav-btn-lg:hover { border-color: #ffc1c1; background: #fff5f5; }
.fav-btn-lg.favored {
  border-color: #ffb3b3;
  background: #fff1f0;
  color: #f56c6c;
  animation: favPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes favPop {
  0% { transform: scale(0.85); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
.product-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.35;
}
.price-line {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 16px 22px;
  background: linear-gradient(135deg, #fff1f0 0%, #fff8f0 100%);
  border-radius: 12px;
  border-left: 4px solid #f56c6c;
}
.price-symbol {
  color: #f56c6c;
  font-size: 22px;
  font-weight: 600;
}
.price-num {
  color: #f56c6c;
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
}
.price-tip { margin-left: 18px; color: #909399; font-size: 13px; }
.meta-line {
  display: flex;
  gap: 24px;
  padding: 16px 22px;
  background: #f4f7fa;
  border-radius: 12px;
  color: #606266;
  font-size: 14px;
}
.group-line {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 22px;
  background: linear-gradient(135deg, #fdf6ec, #fef4e8);
  border-radius: 12px;
  border-left: 4px solid #e6a23c;
}
.group-info { display: flex; align-items: baseline; gap: 6px; }
.group-current { font-size: 30px; font-weight: 800; color: #e6a23c; }
.group-sep { color: #909399; font-size: 18px; margin: 0 2px; }
.group-target { font-size: 18px; font-weight: 600; color: #e6a23c; }
.group-tip { margin-left: 12px; color: #909399; font-size: 13px; }
.progress {
  width: 100%;
  height: 10px;
  background: #fff;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid #f5dab1;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #e6a23c, #f0c78a);
  transition: width 0.4s;
}
.section-title {
  margin: 0 0 10px;
  font-size: 16px;
  color: #303133;
  font-weight: 600;
}
.desc-section .desc-text {
  margin: 0;
  padding: 14px 18px;
  background: #fafafa;
  border-radius: 10px;
  color: #606266;
  font-size: 15px;
  line-height: 1.75;
  border: 1px dashed #e4e7ed;
  white-space: pre-wrap;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.info-cell {
  padding: 14px 18px;
  background: #fafbfc;
  border: 1px solid #ebeef5;
  border-radius: 10px;
}
.info-cell .label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}
.info-cell .value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}
.info-cell .value.green { color: #67c23a; }
.info-cell .value.warn { color: #e6a23c; }
.info-cell .value.price { color: #f56c6c; font-weight: 700; font-size: 16px; }
.action-row {
  display: flex;
  gap: 14px;
  padding-top: 8px;
  flex-wrap: wrap;
}
.btn {
  padding: 12px 28px;
  border-radius: 12px;
  border: 1px solid transparent;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
  min-width: 160px;
}
.btn-contact {
  background: linear-gradient(135deg, #409eff, #66b1ff);
  color: #fff;
  box-shadow: 0 4px 14px rgba(64, 158, 255, 0.28);
}
.btn-contact:hover {
  filter: brightness(1.06);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.38);
}
.btn-fav-ghost {
  background: #fff;
  border-color: #ebeef5;
  color: #606266;
}
.btn-fav-ghost:hover { color: #e6a23c; border-color: #faecd1; background: #fffbf0; }
.btn-fav-ghost.favored { color: #f56c6c; border-color: #ffc1c1; background: #fff5f5; }
.tips-box {
  margin-top: 4px;
  padding: 18px 22px;
  background: linear-gradient(135deg, #ecf5ff, #f4faff);
  border: 1px dashed #b3d8ff;
  border-radius: 12px;
}
.tips-title {
  margin: 0 0 8px;
  font-size: 14px;
  color: #409eff;
  font-weight: 600;
}
.tips-list {
  margin: 0;
  padding-left: 20px;
  color: #606266;
  font-size: 13px;
  line-height: 2;
}
.btn-primary {
  padding: 12px 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  color: #fff;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.btn-primary:hover { filter: brightness(1.06); transform: translateY(-1px); }

@media (max-width: 720px) {
  .detail-card { padding: 20px 18px; }
  .product-title { font-size: 22px; }
  .price-num { font-size: 30px; }
  .info-grid { grid-template-columns: 1fr; }
  .breadcrumb { flex-direction: column; align-items: flex-start; gap: 12px; }
}
</style>

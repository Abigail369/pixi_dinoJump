<template>
  <div class="box" ref="dino"></div>
</template>

<script setup lang="ts">
import * as PIXI from "pixi.js";
import { onBeforeUnmount, onMounted, ref } from "vue";

let dino = ref<HTMLElement>();
let app: PIXI.Application;

let center = {
  x: 0,
  y: 0,
};

/** 初始化画布 */
const initCanvas = () => {
  dino.value = dino.value!;
  center = {
    x: dino.value.clientWidth / 2,
    y: dino.value.clientHeight / 2,
  };
  dinoYPosition = center.y;
  app = new PIXI.Application({
    width: dino.value.clientWidth,
    height: dino.value.clientHeight,
    background: 0xffffff,
    // background: 0x000000,
    resizeTo: dino.value,
    antialias: true,
  });
  dino.value.appendChild(app.view as any);
};

/** 游戏内容容器 */
let container: PIXI.Container;
/** 将容器添加到舞台 */
const createContainer = () => {
  // 游戏内容
  container = new PIXI.Container();
  app.stage.addChild(container);
  // 移动的仙人掌
  cactusContainer = new PIXI.Container();
  app.stage.addChild(cactusContainer);
  // 优先级
  app.stage.sortableChildren = true;
  container.zIndex = 10;
};

/** 基础纹理 */
let baseTexture: PIXI.BaseTexture;
/** 添加恐龙游戏的精灵纹理 */
const createBaseTexture = () => {
  baseTexture = PIXI.BaseTexture.from("/img/game.png");
};

/** 首页内容容器 */
let indexContainer: PIXI.Container;
/** 添加小恐龙图标和提示语 */
const createIndex = () => {
  indexContainer = new PIXI.Container();
  container.addChild(indexContainer);

  const logoTexture = new PIXI.Texture(
    baseTexture,
    new PIXI.Rectangle(75, 0, 90, 100)
  );
  const logoSprite = new PIXI.Sprite(logoTexture);
  logoSprite.scale.set(0.5, 0.5);
  indexContainer.addChild(logoSprite);

  const startText = new PIXI.Text("按空格键开始游戏", {
    fill: 0x212225,
    fontFamily: "Arial",
    fontSize: 24,
    fontWeight: "500",
  });
  startText.position.set(0, 80);
  indexContainer.addChild(startText);

  indexContainer.position.set(center.x - 300, center.y - 280);
};

/** 游戏失败时的容器 */
let gameFailedContainer: PIXI.Container;
/** 添加游戏失败时的内容 */
const createGameFiledSprites = () => {
  //
  // gameFailedContainer = new PIXI.Container();
  // container.addChild(gameFailedContainer);
  // const gameOverTexture = new PIXI.Texture(
  //   baseTexture,
  //   new PIXI.Rectangle(1290, 55, 390, 30)
  // );
  // const gameOverSprite = new PIXI.Sprite(gameOverTexture);
  // gameFailedContainer.addChild(gameOverSprite);
  // gameFailedContainer.position.set(center.x - 300, center.y - 280);
};

/** 监听空格事件：开始游戏和跳跃 */
const createListener = () => {
  window.addEventListener("keydown", keydownFn, false);
};
const keydownFn = (e: KeyboardEvent) => {
  if (isGameover) return;
  if (!isGameing && e.code == "Space") {
    console.log("开始游戏");
    playGame();
    return;
  }
  // 跳跃 并且要防止跳到天上去
  if (isGameing && e.code == "Space" && dinoSprite.y == dinoYPosition) {
    console.log("跳跃");
    runAnimation.visible = false;
    dinoSprite.visible = true;
    jumpSpeed = 20;
  }
};

/************** 游戏内容相关 **************/
/** 游戏中状态 */
let isGameing = false;
/** 游戏结束状态 */
let isGameover = false;
/** 跳跃速度 */
let jumpSpeed = 20;
/** 重力 */
let gravity = 1;
/** 地面及仙人掌等物品的移动速度 */
let spriteMoveSpeed = 7;
/** 得分 */
let score = 0;

/** 开始游戏 */
const playGame = () => {
  isGameing = true;
  // 隐藏首页内容 显示游戏内容
  indexContainer.visible = false;
  dinoSprite.visible = false;
  runAnimation.visible = true;
  groundSprite.visible = true;
  cloudSprite.visible = true;
  spritesMove();
};
/** 结束游戏 */
const gameOver = () => {
  isGameing = false;
  isGameover = true;
  runAnimation.visible = false;
  stupidSprite.visible = true;
};
/** 恐龙的固定位置 */
let dinoXPosition = 80;
let dinoYPosition = 0;
/** 静止和跳跃的恐龙精灵 */
let dinoSprite: PIXI.Sprite;
/** 恐龙跑步动画 */
let runAnimation: PIXI.AnimatedSprite;
/** 碰撞到物体的恐龙精灵 */
let stupidSprite: PIXI.Sprite;
/** 地平线 */
let groundSprite: PIXI.TilingSprite;
/** 云朵 */
let cloudSprite: PIXI.Sprite;
/** 仙人掌容器 */
let cactusContainer: PIXI.Container;
/** 仙人掌数量 - 设置了6颗可选仙人掌 */
const cactusCount = 6;

/** 添加游戏精灵 */
const createGameSprites = () => {
  // 创建静止的恐龙精灵
  const dinoTexture = new PIXI.Texture(
    baseTexture,
    new PIXI.Rectangle(1680, 0, 86, 100)
  );
  dinoSprite = new PIXI.Sprite(dinoTexture);
  dinoSprite.position.set(dinoXPosition, center.y);
  dinoSprite.visible = false;
  container.addChild(dinoSprite);

  // 创建恐龙跑步动画
  const runTextures = [];
  for (let i = 0; i < 2; i++) {
    runTextures.push(
      new PIXI.Texture(
        baseTexture,
        new PIXI.Rectangle(1680 + (2 + i) * 88, 0, 86, 100)
      )
    );
  }
  runAnimation = new PIXI.AnimatedSprite(runTextures);
  runAnimation.animationSpeed = 0.1;
  runAnimation.position.set(dinoXPosition, center.y);
  runAnimation.play();
  runAnimation.visible = false;
  container.addChild(runAnimation);

  // 创建碰撞到物体的恐龙精灵
  const stupidTexture = new PIXI.Texture(
    baseTexture,
    new PIXI.Rectangle(1680 + 4 * 88, 0, 86, 100)
  );
  stupidSprite = new PIXI.Sprite(stupidTexture);
  stupidSprite.position.set(dinoXPosition, center.y);
  stupidSprite.visible = false;
  stupidSprite.zIndex = 100;
  container.addChild(stupidSprite);

  // 创建地平线
  const groundTexture = new PIXI.Texture(
    baseTexture,
    new PIXI.Rectangle(0, 100, 2300, 30)
  );
  groundSprite = new PIXI.TilingSprite(groundTexture);
  groundSprite.width = dino.value!.clientWidth;
  groundSprite.height = 30;
  groundSprite.position.set(0, center.y + 75);
  groundSprite.visible = false;
  container.addChild(groundSprite);

  // 创建云朵精灵
  const cloudTexture = new PIXI.Texture(
    baseTexture,
    new PIXI.Rectangle(165, 0, 100, 30)
  );
  cloudSprite = new PIXI.Sprite(cloudTexture);
  cloudSprite.position.set(center.x, center.y - 220);
  cloudSprite.visible = false;
  container.addChild(cloudSprite);

  // 创建仙人掌精灵们
  for (let i = 0; i < 3; i++) {
    let c = new PIXI.Sprite(
      new PIXI.Texture(
        baseTexture,
        new PIXI.Rectangle(446 + i * 34, 0, 34 * (i + 1), 74)
      )
    );
    c.position.set(center.x * 2, center.y + 28);
    c.visible = false;
    cactusContainer.addChild(c);
  }
  for (let i = 0; i < 2; i++) {
    let c = new PIXI.Sprite(
      new PIXI.Texture(
        baseTexture,
        new PIXI.Rectangle(702 + i * 50, 0, 50, 100)
      )
    );
    c.position.set(center.x * 2, center.y);
    c.visible = false;
    cactusContainer.addChild(c);
  }
  let c = new PIXI.Sprite(
    new PIXI.Texture(baseTexture, new PIXI.Rectangle(850, 0, 102, 100))
  );
  c.position.set(center.x * 2, center.y);
  c.visible = false;
  cactusContainer.addChild(c);
};

/** 使精灵们运动起来 */
const spritesMove = () => {
  // 随机选一颗仙人掌
  let cactusIndex = randomFn(cactusCount);
  let currentCactusSprite = cactusContainer.getChildAt(cactusIndex);
  currentCactusSprite.visible = true;

  let cactusIndex_next = -1;
  let nextCacstusSprite: PIXI.DisplayObject;

  let addScoreFlag = false;

  let firstCactus: PIXI.DisplayObject | null = currentCactusSprite;
  // firstCactus.position.set(0, 100);
  // app.stage.addChild(firstCactus);
  // cactusContainer.addChild(firstCactus);

  app.ticker.add((delta) => {
    if (!isGameing) return;

    // 地平线
    groundSprite.tilePosition.x -= spriteMoveSpeed;
    // 云朵
    cloudSprite.x -= spriteMoveSpeed;
    if (cloudSprite.x <= -cloudSprite.width) {
      cloudSprite.x = center.x * 2;
    }

    if (currentCactusSprite && currentCactusSprite.visible) {
      currentCactusSprite.x -= spriteMoveSpeed;
      if (
        currentCactusSprite.x <= -(currentCactusSprite as PIXI.Sprite).width
      ) {
        // 重置
        currentCactusSprite.visible = false;
        currentCactusSprite.x = center.x * 2;
        cactusIndex = -1;
        addScoreFlag = false;
      }
      // 仙人掌第一次越过恐龙 分数+1
      if (
        currentCactusSprite.x + (currentCactusSprite as PIXI.Sprite).width <=
        dinoSprite.x
      ) {
        if (!addScoreFlag) {
          score++;
          console.log("score:" + score);
          addScoreFlag = true;
          console.log("curr切换下一个");
          firstCactus = null;
          // firstCactus = nextCacstusSprite;
          // debugger;
        }
      }

      // 找到恐龙面对的下一个仙人掌
      if (addScoreFlag && !firstCactus) {
        //
        // console.log(currentCactusSprite.x);
        // console.log(nextCacstusSprite.x);
        firstCactus = nextCacstusSprite;
      }

      // 找一个随机时刻 将第二颗仙人掌添加进去
      if (
        currentCactusSprite.x <= randomFn(center.x * 1.2) &&
        !~cactusIndex_next
      ) {
        cactusIndex_next = randomFn(cactusCount);
        if (cactusIndex_next == cactusIndex) {
          if (cactusIndex_next == 0) cactusIndex_next += 1;
          else cactusIndex_next -= 1;
        }
        nextCacstusSprite = cactusContainer.getChildAt(cactusIndex_next);
        nextCacstusSprite.visible = true;

        // if()
      }

      // if (addScoreFlag && ~cactusIndex_next) {
      //   firstCactus = nextCacstusSprite;
      // }
    }
    if (nextCacstusSprite && nextCacstusSprite.visible) {
      nextCacstusSprite.x -= spriteMoveSpeed;
      if (nextCacstusSprite.x <= -(nextCacstusSprite as PIXI.Sprite).width) {
        // 重置
        nextCacstusSprite.visible = false;
        nextCacstusSprite.x = center.x * 2;
        cactusIndex_next = -1;
        addScoreFlag = false;
      }
      // 仙人掌第一次越过恐龙 分数+1
      if (
        nextCacstusSprite.x + (nextCacstusSprite as PIXI.Sprite).width <=
        dinoSprite.x
      ) {
        if (!addScoreFlag) {
          score++;
          console.log("score:" + score);
          addScoreFlag = true;
          // firstCactus = currentCactusSprite;
          // debugger;
          console.log("next切换下一个");
          firstCactus = null;
          // debugger;
        }
      }
      // 找到恐龙面对的下一个仙人掌
      if (addScoreFlag && !firstCactus) {
        //
        // console.log(currentCactusSprite.x);
        // console.log(nextCacstusSprite.x);
        firstCactus = currentCactusSprite;
      }
      // 找一个随机时刻 将第一颗仙人掌添加进去
      if (nextCacstusSprite.x < randomFn(center.x * 1.2) && !~cactusIndex) {
        cactusIndex = randomFn(cactusCount);
        if (cactusIndex == cactusIndex_next) {
          if (cactusIndex == 0) cactusIndex += 1;
          else cactusIndex -= 1;
        }
        currentCactusSprite = cactusContainer.getChildAt(cactusIndex);
        currentCactusSprite.visible = true;
      }

      // if (addScoreFlag && ~cactusIndex) {
      //   firstCactus = currentCactusSprite;
      // }
    }

    // 恐龙跳跃
    if (dinoSprite.visible) {
      jumpSpeed -= gravity;
      dinoSprite.y -= jumpSpeed;
      if (dinoSprite.y >= dinoYPosition) {
        // 复原
        dinoSprite.y = dinoYPosition;
        jumpSpeed = 20;
        dinoSprite.visible = false;
        runAnimation.visible = true;
        // // 复原后找下一个仙人掌
        // console.log(currentCactusSprite.x);
        // console.log(nextCacstusSprite.x);
        // firstCactus =
        // debugger;
      }
    }
    // 在地面时的碰撞检测
    // let currentX = -99999;
    // let nextX = -99999;
    // if (currentCactusSprite) currentX = currentCactusSprite.x;
    // if (nextCacstusSprite) nextX = nextCacstusSprite.x;
    let dinoRightPosition = runAnimation.x + runAnimation.width - 10;
    if (runAnimation.visible && firstCactus!.x <= dinoRightPosition) {
      console.log("游戏结束");
      gameOver();
      // debugger;
    }
    // console.log();

    // let fontCactusSprite = currentCactusSprite
    //   ? currentCactusSprite
    //   : nextCacstusSprite;
    // 谁大于dinoRightPosition 且离dinoRightPosition更近 就判断哪个仙人掌
    // if (
    //   currentX > dinoRightPosition &&
    //   nextX > dinoRightPosition &&
    //   currentX < nextX
    // )
    //   fontCactusSprite = currentCactusSprite;
    // if (
    //   currentX > dinoRightPosition &&
    //   nextX > dinoRightPosition &&
    //   currentX < nextX
    // )
    //   fontCactusSprite = nextCacstusSprite;
    // fontCactusSprite = firstCactus;
    // if (runAnimation.visible && firstCactus!.x <= dinoRightPosition) {
    //   console.log(firstCactus!.x);
    //   console.log(dinoRightPosition);
    //   console.log("游戏结束");
    //   debugger;
    //   gameOver();
    // }
    // // 跳跃时的碰撞检测 （判断两个矩形是否相交）
    // if (dinoSprite.visible) {
    //   // 计算x方向 2个矩形重心的距离
    //   let dinoCenter = {
    //     x: (dinoSprite.x + dinoSprite.x + dinoSprite.width) / 2,
    //     y: (dinoSprite.y + dinoSprite.y + dinoSprite.height) / 2,
    //   };
    //   let fontCenter = {
    //     x:
    //       (firstCactus!.x +
    //         firstCactus!.x +
    //         (firstCactus as PIXI.Sprite).width) /
    //       2,
    //     y:
    //       (firstCactus!.y +
    //         firstCactus!.y +
    //         (firstCactus as PIXI.Sprite).height) /
    //       2,
    //   };
    //   let distanceX =
    //     (dinoSprite.width + (firstCactus as PIXI.Sprite).width) / 2;
    //   let distanceY =
    //     (dinoSprite.height + (firstCactus as PIXI.Sprite).height) / 2;
    //   if (
    //     Math.abs(dinoCenter.x - fontCenter.x) < distanceX &&
    //     Math.abs(dinoCenter.y - fontCenter.y) < distanceY
    //   ) {
    //     console.log("游戏结束");
    //     gameOver();
    //   }
    // }
  });
};

/** 随机函数 */
const randomFn = (n: number) => {
  return Math.floor(Math.random() * n);
};

onMounted(() => {
  initCanvas();
  createContainer();
  createBaseTexture();
  createIndex();
  createGameFiledSprites();
  createListener();
  createGameSprites();
  // test
  // playGame();
});

onBeforeUnmount(() => {
  container.removeChild();
  window.removeEventListener("keydown", keydownFn);
});
</script>

<style lang="less" scoped>
.box {
  background: #e8fdf8;
  width: 100%;
  height: 100%;
}
</style>

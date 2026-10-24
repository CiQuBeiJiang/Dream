import { useApp } from '@/context/AppContext';
import { siteConfig } from '@/content/config';
import { getTimeFilter } from '@/types';

/**
 * 静态图片背景层。
 * 视频入口保留在配置和上下文中，等动态素材完成后再恢复视频切换。
 */
export default function VideoBackground() {
  const { currentChapter, sliderValue, videoSrc } = useApp();
  const filter = getTimeFilter(sliderValue);

  const isIntro = videoSrc === siteConfig.introVideo;
  const backgroundImage = isIntro ? siteConfig.heroImage : currentChapter.image;
  // 竖屏（手机）只能显示宽图的一小段，用 focus 决定保留画面的哪一部分
  const backgroundPosition = (isIntro ? siteConfig.heroImageFocus : currentChapter.imageFocus) ?? 'center';

  return (
    <div
      className="fixed inset-0 z-0 bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition,
        filter: `brightness(${filter.brightness}) sepia(${filter.sepia}) saturate(${filter.saturate}) hue-rotate(${filter.hueRotate}deg)`,
        transition: 'background-image 0.8s ease, filter 0.4s ease',
      }}
      aria-hidden="true"
    />
  );
}

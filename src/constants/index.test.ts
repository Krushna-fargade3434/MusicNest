import { describe, it, expect } from 'vitest';
import { 
  AUDIO_EXTENSIONS, 
  VIDEO_EXTENSIONS, 
  AVATAR_COLORS,
  ACCENT_COLORS,
  DEFAULT_VOLUME,
  SEEK_RESTART_THRESHOLD,
} from './index';

describe('Constants', () => {
  it('should have valid audio extensions', () => {
    expect(AUDIO_EXTENSIONS).toHaveLength(7);
    expect(AUDIO_EXTENSIONS).toContain('.mp3');
    expect(AUDIO_EXTENSIONS).toContain('.wav');
    expect(AUDIO_EXTENSIONS).toContain('.flac');
  });

  it('should have valid video extensions', () => {
    expect(VIDEO_EXTENSIONS).toHaveLength(7);
    expect(VIDEO_EXTENSIONS).toContain('.mp4');
    expect(VIDEO_EXTENSIONS).toContain('.mkv');
  });

  it('should have avatar colors', () => {
    expect(AVATAR_COLORS).toHaveLength(6);
    AVATAR_COLORS.forEach(color => {
      expect(color).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
    });
  });

  it('should have accent color configurations', () => {
    expect(ACCENT_COLORS.purple).toBeDefined();
    expect(ACCENT_COLORS.blue).toBeDefined();
    expect(ACCENT_COLORS.green).toBeDefined();

    const colorConfigs = [ACCENT_COLORS.purple, ACCENT_COLORS.blue, ACCENT_COLORS.green];
    colorConfigs.forEach(config => {
      expect(config.primary).toBeDefined();
      expect(config.ring).toBeDefined();
      expect(config.accent).toBeDefined();
    });
  });

  it('should have valid default volume', () => {
    expect(DEFAULT_VOLUME).toBe(0.7);
    expect(DEFAULT_VOLUME).toBeGreaterThan(0);
    expect(DEFAULT_VOLUME).toBeLessThanOrEqual(1);
  });

  it('should have valid seek restart threshold', () => {
    expect(SEEK_RESTART_THRESHOLD).toBe(3);
    expect(SEEK_RESTART_THRESHOLD).toBeGreaterThan(0);
  });
});

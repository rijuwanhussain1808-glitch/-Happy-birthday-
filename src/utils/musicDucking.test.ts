import test from 'node:test';
import assert from 'node:assert/strict';
import { handleVideoPlaybackTransition } from './musicDucking';

test('handleVideoPlaybackTransition ducks volume to 0 and silences music on videoPlay', () => {
  const result = handleVideoPlaybackTransition('videoPlay', true);
  assert.equal(result.shouldPlayMusic, false);
  assert.equal(result.targetVolume, 0);
});

test('handleVideoPlaybackTransition automatically plays background music on videoEnded', () => {
  // Regardless of whether music was playing before, video ended automatically triggers background music
  const result1 = handleVideoPlaybackTransition('videoEnded', false);
  assert.equal(result1.shouldPlayMusic, true);
  assert.equal(result1.targetVolume, 1);

  const result2 = handleVideoPlaybackTransition('videoEnded', true);
  assert.equal(result2.shouldPlayMusic, true);
  assert.equal(result2.targetVolume, 1);
});

test('handleVideoPlaybackTransition restores music on modalClose if previously playing', () => {
  const resultPlaying = handleVideoPlaybackTransition('modalClose', true);
  assert.equal(resultPlaying.shouldPlayMusic, true);
  assert.equal(resultPlaying.targetVolume, 1);

  const resultPaused = handleVideoPlaybackTransition('modalClose', false);
  assert.equal(resultPaused.shouldPlayMusic, false);
  assert.equal(resultPaused.targetVolume, 1);
});

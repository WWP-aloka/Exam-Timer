import churchBell from '@assets/11325622-church-bell-sound-effect-241382_1776936538140.mp3';
import bigBell from '@assets/the_69-big-bell-330719_1776936538140.mp3';
import schoolBell from '@assets/stu9-schl-bell-356847_1776936538141.mp3';
import freesoundBell from '@assets/freesound_community-bell-98033_1776936538141.mp3';
import singleChurchBell from '@assets/universfield-single-church-bell-2-352062_1776936538141.mp3';
import singleChurchBellAlt from '@assets/universfield-single-church-bell-2-352062_(1)_1776936538141.mp3';
import attentionBell from '@assets/mixkit-attention-bell-ding-586_1776936538142.wav';

export type SoundId =
  | 'chime'
  | 'highBell'
  | 'doubleBell'
  | 'churchBell'
  | 'bigBell'
  | 'schoolBell'
  | 'freesoundBell'
  | 'singleChurchBell'
  | 'singleChurchBellAlt'
  | 'attentionBell';

export interface SoundOption {
  id: SoundId;
  label: string;
  kind: 'synth' | 'file';
  src?: string;
}

export const SOUND_LIBRARY: SoundOption[] = [
  { id: 'chime', label: 'Soft Chime (880 Hz)', kind: 'synth' },
  { id: 'highBell', label: 'High Bell (10 kHz)', kind: 'synth' },
  { id: 'doubleBell', label: 'Double Bell (synth)', kind: 'synth' },
  { id: 'attentionBell', label: 'Attention Bell Ding', kind: 'file', src: attentionBell },
  { id: 'schoolBell', label: 'School Bell', kind: 'file', src: schoolBell },
  { id: 'freesoundBell', label: 'Classic Bell', kind: 'file', src: freesoundBell },
  { id: 'singleChurchBell', label: 'Single Church Bell', kind: 'file', src: singleChurchBell },
  { id: 'singleChurchBellAlt', label: 'Single Church Bell (alt)', kind: 'file', src: singleChurchBellAlt },
  { id: 'churchBell', label: 'Church Bell', kind: 'file', src: churchBell },
  { id: 'bigBell', label: 'Big Bell', kind: 'file', src: bigBell },
];

export function getSoundOption(id: SoundId): SoundOption {
  return SOUND_LIBRARY.find((s) => s.id === id) ?? SOUND_LIBRARY[0];
}

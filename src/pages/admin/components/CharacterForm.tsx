import { useState } from 'react';
import type { Character } from '../../../types/character';
import ImageUpload from '../../../components/base/ImageUpload';

interface Props {
  character?: Character | null;
  onSave: (data: Partial<Character>) => Promise<void>;
  onCancel: () => void;
}

const emptyStats = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
const emptySavingThrows = { str: false, dex: false, con: false, int: false, wis: false, cha: false };

const INPUT_STYLE: React.CSSProperties = {
  border: '1px solid #1C1C1C',
  color: '#A0A098',
  caretColor: '#6ECFB8',
  backgroundColor: 'transparent',
};

const LABEL_STYLE: React.CSSProperties = { color: '#585854' };

/* ── 모듈 레벨 컴포넌트 (리렌더링 시 재생성 안 됨) ── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-mono text-xs mb-2" style={LABEL_STYLE}>{label}</label>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm bg-transparent outline-none"
      style={INPUT_STYLE}
      placeholder={placeholder}
    />
  );
}

function TagInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [inputVal, setInputVal] = useState('');
  const add = () => {
    const trimmed = inputVal.trim();
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed]);
    setInputVal('');
  };
  const remove = (tag: string) => onChange(value.filter((t) => t !== tag));

  return (
    <div>
      <label className="block font-mono text-xs mb-2" style={LABEL_STYLE}>{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-1 font-mono text-xs"
            style={{ border: '1px solid rgba(110,207,184,0.3)', color: '#6ECFB8' }}
          >
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              className="ml-1 cursor-pointer"
              style={{ color: '#585854' }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          className="flex-1 px-3 py-2 text-xs bg-transparent outline-none"
          style={INPUT_STYLE}
          placeholder="입력 후 Enter 또는 추가"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 font-mono text-xs cursor-pointer whitespace-nowrap"
          style={{ border: '1px solid #1C1C1C', color: '#585854' }}
        >
          추가
        </button>
      </div>
    </div>
  );
}

/* ── 메인 폼 ── */
export default function CharacterForm({ character, onSave, onCancel }: Props) {
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(character?.name ?? '');
  const [nameEn, setNameEn] = useState(character?.name_en ?? '');
  const [title, setTitle] = useState(character?.title ?? '');
  const [titleEn, setTitleEn] = useState(character?.title_en ?? '');
  const [race, setRace] = useState(character?.race ?? '');
  const [age, setAge] = useState(character?.age ?? '');
  const [height, setHeight] = useState(character?.height ?? '');
  const [weight, setWeight] = useState(character?.weight ?? '');
  const [charClass, setCharClass] = useState(character?.class ?? '');
  const [affiliation, setAffiliation] = useState(character?.affiliation ?? '');
  const [origin, setOrigin] = useState(character?.origin ?? '');
  const [specialty, setSpecialty] = useState<string[]>(character?.specialty ?? []);
  const [weakness, setWeakness] = useState<string[]>(character?.weakness ?? []);
  const [motto, setMotto] = useState(character?.motto ?? '');
  const [mottoEn, setMottoEn] = useState(character?.motto_en ?? '');
  const [personality, setPersonality] = useState(character?.personality ?? '');
  const [background, setBackground] = useState(character?.background ?? '');
  const [stats, setStats] = useState(character?.stats ?? emptyStats);
  const [savingThrows, setSavingThrows] = useState(character?.stat_saving_throws ?? emptySavingThrows);
  const [profBonus, setProfBonus] = useState(character?.proficiency_bonus ?? 2);
  const [abilities, setAbilities] = useState(
    character?.abilities ?? [{ name: '', nameEn: '', description: '' }]
  );
  const [image, setImage] = useState(character?.image ?? '');
  const [heroImage, setHeroImage] = useState(character?.hero_image ?? '');
  const [displayOrder, setDisplayOrder] = useState(character?.display_order ?? 0);

  const statKeys = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;
  const statLabels: Record<string, string> = {
    str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA',
  };

  const updateAbility = (idx: number, key: string, val: string) =>
    setAbilities((prev) => prev.map((a, i) => (i === idx ? { ...a, [key]: val } : a)));
  const addAbility = () =>
    setAbilities((prev) => [...prev, { name: '', nameEn: '', description: '' }]);
  const removeAbility = (idx: number) =>
    setAbilities((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      name, name_en: nameEn, title, title_en: titleEn,
      race, age, height, weight, class: charClass,
      affiliation, origin, specialty, weakness,
      motto, motto_en: mottoEn, personality, background,
      stats, stat_saving_throws: savingThrows,
      proficiency_bonus: profBonus,
      abilities: abilities.filter((a) => a.name),
      image, hero_image: heroImage, display_order: displayOrder,
    });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* BASIC INFO */}
      <section>
        <p className="font-mono text-xs mb-5" style={{ color: '#6ECFB8', letterSpacing: '0.15em' }}>BASIC INFO</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="이름 (한국어)">
            <TextInput value={name} onChange={setName} placeholder="아라엘 에세린" />
          </Field>
          <Field label="NAME (EN)">
            <TextInput value={nameEn} onChange={setNameEn} placeholder="Arael Esserin" />
          </Field>
          <Field label="칭호 (한국어)">
            <TextInput value={title} onChange={setTitle} placeholder="망각의 아르케마지" />
          </Field>
          <Field label="TITLE (EN)">
            <TextInput value={titleEn} onChange={setTitleEn} placeholder="Archmage of Oblivion" />
          </Field>
          <Field label="종족">
            <TextInput value={race} onChange={setRace} placeholder="반요정" />
          </Field>
          <Field label="나이">
            <TextInput value={age} onChange={setAge} placeholder="외형 24세" />
          </Field>
          <Field label="신장">
            <TextInput value={height} onChange={setHeight} placeholder="168cm" />
          </Field>
          <Field label="체중">
            <TextInput value={weight} onChange={setWeight} placeholder="53kg" />
          </Field>
          <Field label="직업/클래스">
            <TextInput value={charClass} onChange={setCharClass} placeholder="마법사" />
          </Field>
          <Field label="소속">
            <TextInput value={affiliation} onChange={setAffiliation} placeholder="없음" />
          </Field>
          <Field label="출신">
            <TextInput value={origin} onChange={setOrigin} placeholder="에레노아 숲" />
          </Field>
          <Field label="표시 순서">
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-transparent outline-none"
              style={INPUT_STYLE}
            />
          </Field>
        </div>
      </section>

      {/* TRAITS */}
      <section>
        <p className="font-mono text-xs mb-5" style={{ color: '#6ECFB8', letterSpacing: '0.15em' }}>TRAITS</p>
        <div className="space-y-4">
          <TagInput label="특기" value={specialty} onChange={setSpecialty} />
          <TagInput label="약점" value={weakness} onChange={setWeakness} />
        </div>
      </section>

      {/* MOTTO */}
      <section>
        <p className="font-mono text-xs mb-5" style={{ color: '#6ECFB8', letterSpacing: '0.15em' }}>MOTTO</p>
        <div className="space-y-3">
          <Field label="모토 (한국어)">
            <TextInput value={motto} onChange={setMotto} />
          </Field>
          <Field label="MOTTO (EN)">
            <TextInput value={mottoEn} onChange={setMottoEn} />
          </Field>
        </div>
      </section>

      {/* NARRATIVE */}
      <section>
        <p className="font-mono text-xs mb-5" style={{ color: '#6ECFB8', letterSpacing: '0.15em' }}>NARRATIVE</p>
        <div className="space-y-4">
          <div>
            <label className="block font-mono text-xs mb-2" style={LABEL_STYLE}>성격 (PERSONALITY)</label>
            <textarea
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 text-sm bg-transparent outline-none resize-y"
              style={{ ...INPUT_STYLE, minHeight: '120px' }}
            />
          </div>
          <div>
            <label className="block font-mono text-xs mb-2" style={LABEL_STYLE}>배경 (BACKGROUND)</label>
            <textarea
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 text-sm bg-transparent outline-none resize-y"
              style={{ ...INPUT_STYLE, minHeight: '120px' }}
            />
          </div>
        </div>
      </section>

      {/* D&D 5E STATS */}
      <section>
        <p className="font-mono text-xs mb-5" style={{ color: '#6ECFB8', letterSpacing: '0.15em' }}>D&amp;D 5E STATS</p>
        <div className="grid grid-cols-6 gap-3 mb-4">
          {statKeys.map((key) => (
            <div key={key} className="flex flex-col items-center gap-2">
              <label className="font-mono text-xs" style={{ color: '#585854' }}>{statLabels[key]}</label>
              <input
                type="number"
                min={1}
                max={30}
                value={stats[key]}
                onChange={(e) => setStats((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
                className="w-full text-center px-1 py-2 text-sm bg-transparent outline-none"
                style={INPUT_STYLE}
              />
              <label className="flex items-center gap-1 font-mono text-xs cursor-pointer" style={{ color: '#383834' }}>
                <input
                  type="checkbox"
                  checked={savingThrows[key]}
                  onChange={(e) => setSavingThrows((prev) => ({ ...prev, [key]: e.target.checked }))}
                  className="cursor-pointer"
                  style={{ accentColor: '#6ECFB8' }}
                />
                저항
              </label>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label className="font-mono text-xs" style={LABEL_STYLE}>숙련 보너스</label>
          <input
            type="number"
            min={1}
            max={9}
            value={profBonus}
            onChange={(e) => setProfBonus(Number(e.target.value))}
            className="w-20 px-3 py-2 text-sm bg-transparent outline-none"
            style={INPUT_STYLE}
          />
        </div>
      </section>

      {/* ABILITIES */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <p className="font-mono text-xs" style={{ color: '#6ECFB8', letterSpacing: '0.15em' }}>ABILITIES</p>
          <button
            type="button"
            onClick={addAbility}
            className="font-mono text-xs px-3 py-1 cursor-pointer whitespace-nowrap"
            style={{ border: '1px solid #1C1C1C', color: '#585854' }}
          >
            + 추가
          </button>
        </div>
        <div className="space-y-4">
          {abilities.map((ability, idx) => (
            <div key={idx} className="p-4" style={{ border: '1px solid #1C1C1C' }}>
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-xs" style={{ color: '#383834' }}>ABILITY {idx + 1}</span>
                {abilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAbility(idx)}
                    className="font-mono text-xs cursor-pointer"
                    style={{ color: '#585854' }}
                  >
                    × 제거
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Field label="이름 (한국어)">
                  <input
                    type="text"
                    value={ability.name}
                    onChange={(e) => updateAbility(idx, 'name', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-transparent outline-none"
                    style={INPUT_STYLE}
                  />
                </Field>
                <Field label="NAME (EN)">
                  <input
                    type="text"
                    value={ability.nameEn}
                    onChange={(e) => updateAbility(idx, 'nameEn', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-transparent outline-none"
                    style={INPUT_STYLE}
                  />
                </Field>
              </div>
              <Field label="설명">
                <textarea
                  value={ability.description}
                  onChange={(e) => updateAbility(idx, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm bg-transparent outline-none resize-y"
                  style={INPUT_STYLE}
                />
              </Field>
            </div>
          ))}
        </div>
      </section>

      {/* IMAGES */}
      <section>
        <p className="font-mono text-xs mb-5" style={{ color: '#6ECFB8', letterSpacing: '0.15em' }}>IMAGES</p>
        <div className="space-y-5">
          <div>
            <label className="block font-mono text-xs mb-2" style={LABEL_STYLE}>프로필 이미지</label>
            <ImageUpload value={image} onChange={setImage} aspect="portrait" folder="characters" />
          </div>
          <div>
            <label className="block font-mono text-xs mb-2" style={LABEL_STYLE}>히어로 이미지</label>
            <ImageUpload value={heroImage} onChange={setHeroImage} aspect="wide" folder="characters" />
          </div>
        </div>
      </section>

      {/* ACTIONS */}
      <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid #1C1C1C' }}>
        <button
          type="submit"
          disabled={saving || !name}
          className="px-6 py-3 font-mono text-xs tracking-widest uppercase cursor-pointer whitespace-nowrap transition-colors"
          style={{
            border: '1px solid rgba(110,207,184,0.3)',
            backgroundColor: 'rgba(110,207,184,0.1)',
            color: saving ? '#383834' : '#6ECFB8',
          }}
        >
          {saving ? 'SAVING...' : character ? 'UPDATE' : 'CREATE'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 font-mono text-xs tracking-widest uppercase cursor-pointer whitespace-nowrap"
          style={{ border: '1px solid #1C1C1C', color: '#585854' }}
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}

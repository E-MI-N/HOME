import { useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Props {
  value: string;
  onChange: (url: string) => void;
  /** 미리보기 aspect ratio: 'square' | 'portrait' | 'landscape' | 'wide' */
  aspect?: 'square' | 'portrait' | 'landscape' | 'wide';
  placeholder?: string;
  folder?: string;
}

const ASPECT_SIZE: Record<string, { w: number; h: number }> = {
  square:    { w: 80,  h: 80  },
  portrait:  { w: 80,  h: 100 },
  landscape: { w: 140, h: 90  },
  wide:      { w: 280, h: 158 },
};

export default function ImageUpload({
  value,
  onChange,
  aspect = 'square',
  placeholder = 'https://...',
  folder = 'uploads',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { w, h } = ASPECT_SIZE[aspect];

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능해요.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('파일 크기는 10MB 이하로 해주세요.');
      return;
    }

    setError('');
    setUploading(true);

    const ext = file.name.split('.').pop() ?? 'jpg';
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from('images')
      .upload(fileName, file, { upsert: false });

    if (upErr) {
      setError('업로드 실패: ' + upErr.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('images').getPublicUrl(fileName);
    onChange(data.publicUrl);
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      {/* URL 직접 입력 */}
      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 font-mono text-xs outline-none"
          style={{ backgroundColor: '#0C0C0C', border: '1px solid #1C1C1C', color: '#F0EEE8' }}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 font-mono text-xs cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5"
          style={{
            border: '1px solid rgba(110,207,184,0.3)',
            color: uploading ? '#383834' : '#6ECFB8',
            backgroundColor: 'rgba(110,207,184,0.05)',
            minWidth: '100px',
            justifyContent: 'center',
          }}
        >
          {uploading ? (
            <>
              <i className="ri-loader-4-line animate-spin" style={{ fontSize: '12px' }} />
              업로드 중
            </>
          ) : (
            <>
              <i className="ri-upload-2-line" style={{ fontSize: '12px' }} />
              파일 업로드
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
        />
      </div>

      {/* 드래그 앤 드롭 존 (이미지 없을 때) */}
      {!value && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
          style={{
            width: `${w}px`,
            height: `${h}px`,
            border: '1px dashed #2C2C2C',
            color: '#383834',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(110,207,184,0.3)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#2C2C2C')}
        >
          <i className="ri-image-add-line" style={{ fontSize: '20px' }} />
          <span className="font-mono" style={{ fontSize: '9px' }}>드래그 or 클릭</span>
        </div>
      )}

      {/* 미리보기 */}
      {value && (
        <div className="relative group" style={{ width: `${w}px`, height: `${h}px` }}>
          <img
            src={value}
            alt="preview"
            className="w-full h-full object-cover object-top"
            style={{ border: '1px solid #1C1C1C' }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', border: '1px solid #383834', color: '#FF6B6B' }}
            title="이미지 제거"
          >
            <i className="ri-close-line" style={{ fontSize: '11px' }} />
          </button>
        </div>
      )}

      {error && (
        <p className="font-mono text-xs" style={{ color: '#FF6B6B' }}>{error}</p>
      )}
    </div>
  );
}

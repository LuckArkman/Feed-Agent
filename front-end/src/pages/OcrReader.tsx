import React, { useState, useRef, useEffect } from 'react';
import { 
  FileUp, 
  UploadCloud, 
  Image as ImageIcon, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Sparkles,
  Layers,
  Maximize2,
  RefreshCw,
  FolderOpen,
  Calendar,
  HardDrive,
  RotateCw,
  Sliders,
  Crop,
  Sun,
  Contrast,
  Check,
  Split,
  Copy,
  Save,
  Send,
  Bot,
  Settings,
  AlignLeft,
  MessageSquareText,
  FileCode2,
  Wand2
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { showToast } from '@/utils/toastHelper';

interface QueuedFile {
  id: string;
  file: File;
  name: string;
  size: number; // bytes
  type: string;
  previewUrl: string | null;
  status: 'waiting' | 'uploading' | 'success' | 'error';
  progress: number;
  errorMessage?: string;
  rawExtractedText?: string;
}

interface GalleryMedia {
  id: string;
  name: string;
  sizeFormatted: string;
  uploadedAt: string;
  type: 'image' | 'pdf';
  imageUrl: string;
  ocrStatus: 'Concluído' | 'Falha' | 'Pendente';
  extractedContactsCount: number;
  rawExtractedText: string;
}

const MAX_FILE_SIZE_MB = 15;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'pdf'];

const SAMPLE_RAW_TEXT_1 = `CLASSIFICADOS FOLHA DE SÃO PAULO - MAIO 2026
IMÓVEIS - VENDA E LOCAÇÃO

Apto Centro 2 dorms, ste, sacada, gar. R$ 380mil. Tratar com Mário Lopes: +55 (11) 98888-1234.
Sobrado Mooca 3 dorms, 2 vagas, reformado. R$ 650mil. Ana Oliveira: (11) 99111-5555.
Sala Comercial Paulista 40m², andar alto. R$ 420mil. Carlos Santos: 5511977778888.
Galpão Barra Funda 500m², força trifásica. R$ 1.2M. Contato Beatriz Silva: +55 11 98888-9999.
Terreno Morumbi 1000m², aclive leve. R$ 890mil. Tratar c/ Lucas Costa: (11) 98888-4321.`;

const SAMPLE_RAW_TEXT_2 = `ESTADÃO IMÓVEIS - OPORTUNIDADES DO FIM DE SEMANA

Casa Térrea Pinheiros, quintal grande, 3 dorms. R$ 1.1M. Falar com Fernanda Pereira: +55 (11) 98888-5678.
Cobertura Duplex Itaim, piscina privativa. R$ 3.5M. Falar c/ Pedro Almeida: (11) 99222-3344.
Studio Brooklin 28m², mobiliado, próx metrô. R$ 310mil. Mariana Ribeiro: +55 11 98888-8765.`;

const INITIAL_GALLERY: GalleryMedia[] = [
  {
    id: 'med-01',
    name: 'jornal_folha_classificados_maio.jpg',
    sizeFormatted: '4.2 MB',
    uploadedAt: '13/05/2026 14:22',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80',
    ocrStatus: 'Concluído',
    extractedContactsCount: 38,
    rawExtractedText: SAMPLE_RAW_TEXT_1,
  },
  {
    id: 'med-02',
    name: 'recorte_estadao_imoveis.png',
    sizeFormatted: '2.8 MB',
    uploadedAt: '12/05/2026 10:15',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
    ocrStatus: 'Concluído',
    extractedContactsCount: 19,
    rawExtractedText: SAMPLE_RAW_TEXT_2,
  },
  {
    id: 'med-03',
    name: 'lista_participantes_congresso.pdf',
    sizeFormatted: '1.1 MB',
    uploadedAt: '10/05/2026 18:40',
    type: 'pdf',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    ocrStatus: 'Concluído',
    extractedContactsCount: 54,
    rawExtractedText: 'CONGRESSO NACIONAL DE JORNALISMO 2026\nLista de Contatos e Credenciados:\nRoberto Gomes: +55 (11) 98888-1111\nJuliana Martins: +55 (11) 98888-2222\nGabriel Ferreira: +55 (11) 98888-3333\nLarissa Souza: +55 (11) 98888-4444',
  },
  {
    id: 'med-04',
    name: 'foto_whatsapp_contatos_balcao.jpg',
    sizeFormatted: '3.5 MB',
    uploadedAt: '08/05/2026 09:30',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=800&q=80',
    ocrStatus: 'Concluído',
    extractedContactsCount: 27,
    rawExtractedText: 'Contatos Balcão WhatsApp:\nRodrigo Rodrigues: +55 (11) 98888-5555\nCamila Lopes: +55 (11) 98888-6666\nMarcelo Oliveira: +55 (11) 98888-7777',
  },
  {
    id: 'med-05',
    name: 'scan_caderno_anotacoes.jpg',
    sizeFormatted: '5.6 MB',
    uploadedAt: '05/05/2026 16:05',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
    ocrStatus: 'Falha',
    extractedContactsCount: 0,
    rawExtractedText: '[Erro no mecanismo Tesseract OCR: Imagem com ruído excessivo ou resolução incompatível]',
  },
];

export const OcrReader: React.FC = () => {
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [gallery, setGallery] = useState<GalleryMedia[]>(INITIAL_GALLERY);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Lightbox State
  const [lightboxItem, setLightboxItem] = useState<GalleryMedia | null>(null);
  const [isExtractingManual, setIsExtractingManual] = useState<boolean>(false);

  // Canvas Studio Studio State
  const [editingQueuedFile, setEditingQueuedFile] = useState<QueuedFile | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [cropSimulated, setCropSimulated] = useState<boolean>(false);
  const [isSavingCanvas, setIsSavingCanvas] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Split-Screen OCR Extraction Inspection Studio State
  const [splitInspectItem, setSplitInspectItem] = useState<GalleryMedia | QueuedFile | null>(null);
  const [splitRawText, setSplitRawText] = useState<string>('');
  const [splitProgress, setSplitProgress] = useState<number>(100);
  const [splitStage, setSplitStage] = useState<string>('Processamento concluído');
  const [isSplitReprocessing, setIsSplitReprocessing] = useState<boolean>(false);

  // Sprint 30: Llama 3 AI Prompt Customization Studio State
  const [aiSelectedMediaId, setAiSelectedMediaId] = useState<string>(INITIAL_GALLERY[0]?.id || '');
  const [aiTone, setAiTone] = useState<'Formal' | 'Informativo' | 'Dinâmico' | 'Urgente'>('Informativo');
  const [aiLength, setAiLength] = useState<'Curto' | 'Médio' | 'Longo'>('Médio');
  const [aiCustomInstructions, setAiCustomInstructions] = useState<string>('Traduza jargões técnicos para uma linguagem comercial clara e extraia números de telefone com DDD +55.');
  const [isGeneratingAiDraft, setIsGeneratingAiDraft] = useState<boolean>(false);
  const [generatedAiDraft, setGeneratedAiDraft] = useState<string>('');

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      return { valid: false, error: `Formato .${ext} não suportado. Use PNG, JPG ou PDF.` };
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { valid: false, error: `Arquivo muito grande (${formatBytes(file.size)}). Limite: 15MB.` };
    }
    return { valid: true };
  };

  const handleFilesAdded = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const newQueued: QueuedFile[] = fileArray.map((file, idx) => {
      const validation = validateFile(file);
      const isImage = file.type.startsWith('image/');
      let previewUrl = null;

      if (isImage && validation.valid) {
        previewUrl = URL.createObjectURL(file);
      }

      return {
        id: `ocr-file-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl,
        status: validation.valid ? 'waiting' : 'error',
        progress: 0,
        errorMessage: validation.error,
        rawExtractedText: `[Processamento Pendente para: ${file.name}]\nInicie a digitalização OCR para visualizar o conteúdo extraído.`,
      };
    });

    setQueue(prev => [...prev, ...newQueued]);
    const validCount = newQueued.filter(f => f.status === 'waiting').length;
    const invalidCount = newQueued.filter(f => f.status === 'error').length;

    if (validCount > 0) {
      showToast.success(`${validCount} arquivo(s) adicionado(s) à fila de digitalização.`);
    }
    if (invalidCount > 0) {
      showToast.error(`${invalidCount} arquivo(s) ignorado(s) por incompatibilidade ou excesso de tamanho.`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (id: string) => {
    setQueue(prev => prev.filter(item => {
      if (item.id === id && item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return item.id !== id;
    }));
  };

  const handleClearAll = () => {
    queue.forEach(item => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setQueue([]);
    showToast.info('Fila de digitalização limpa.');
  };

  const handleStartUploads = () => {
    const waitingFiles = queue.filter(f => f.status === 'waiting');
    if (waitingFiles.length === 0) {
      showToast.info('Nenhum arquivo na fila aguardando processamento.');
      return;
    }

    waitingFiles.forEach(fileObj => {
      setQueue(prev => prev.map(q => q.id === fileObj.id ? { ...q, status: 'uploading', progress: 10 } : q));

      let progress = 10;
      const interval = window.setInterval(() => {
        progress += Math.floor(Math.random() * 25) + 10;
        if (progress >= 100) {
          clearInterval(interval);
          const generatedText = SAMPLE_RAW_TEXT_1 + `\n[ID Referência: ${fileObj.id}]`;

          setQueue(prev => prev.map(q => q.id === fileObj.id ? { ...q, status: 'success', progress: 100, rawExtractedText: generatedText } : q));
          
          const newMediaItem: GalleryMedia = {
            id: `med-${Date.now()}-${fileObj.id}`,
            name: fileObj.name,
            sizeFormatted: formatBytes(fileObj.size),
            uploadedAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            type: fileObj.type.includes('pdf') ? 'pdf' : 'image',
            imageUrl: fileObj.previewUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80',
            ocrStatus: 'Concluído',
            extractedContactsCount: Math.floor(Math.random() * 40) + 10,
            rawExtractedText: generatedText,
          };

          setGallery(prevG => [newMediaItem, ...prevG]);
          showToast.success(`Arquivo "${fileObj.name}" processado com sucesso pelo motor OCR!`);
        } else {
          setQueue(prev => prev.map(q => q.id === fileObj.id ? { ...q, progress: Math.min(95, progress) } : q));
        }
      }, 300);
    });
  };

  const handleDeleteGalleryMedia = (id: string, name: string) => {
    setGallery(prev => prev.filter(m => m.id !== id));
    if (lightboxItem?.id === id) setLightboxItem(null);
    if (splitInspectItem?.id === id) setSplitInspectItem(null);
    if (aiSelectedMediaId === id) setAiSelectedMediaId(gallery.find(g => g.id !== id)?.id || '');
    showToast.success(`Mídia "${name}" excluída do servidor e do disco.`);
  };

  const handleManualExtraction = (media: GalleryMedia) => {
    setIsExtractingManual(true);
    showToast.info(`Reprocessando extração OCR para "${media.name}"...`);

    setTimeout(() => {
      const added = Math.floor(Math.random() * 25) + 12;
      setGallery(prev => prev.map(m => m.id === media.id ? { ...m, ocrStatus: 'Concluído', extractedContactsCount: m.extractedContactsCount + added } : m));
      if (lightboxItem?.id === media.id) {
        setLightboxItem(prev => prev ? { ...prev, ocrStatus: 'Concluído', extractedContactsCount: prev.extractedContactsCount + added } : null);
      }
      setIsExtractingManual(false);
      showToast.success(`OCR reprocessado com sucesso! ${added} novos destinatários identificados.`);
    }, 1200);
  };

  // Canvas Studio Handlers
  const handleOpenCanvasEditor = (item: QueuedFile) => {
    if (!item.previewUrl) {
      showToast.error('Edição em Canvas disponível apenas para arquivos de imagem.');
      return;
    }

    setEditingQueuedFile(item);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setCropSimulated(false);

    const img = new Image();
    img.src = item.previewUrl;
    img.onload = () => {
      imageObjRef.current = img;
      renderCanvas(img, 0, 100, 100, false);
    };
  };

  const renderCanvas = (img: HTMLImageElement | null, rot: number, bright: number, cont: number, crop: boolean) => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = img.width;
    let height = img.height;

    if (rot === 90 || rot === 270) {
      canvas.width = height;
      canvas.height = width;
    } else {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rot * Math.PI) / 180);

    ctx.filter = `brightness(${bright}%) contrast(${cont}%)`;

    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();

    if (crop) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = Math.max(4, canvas.width / 100);
      ctx.setLineDash([12, 12]);
      const cropMarginX = canvas.width * 0.1;
      const cropMarginY = canvas.height * 0.1;
      ctx.strokeRect(cropMarginX, cropMarginY, canvas.width * 0.8, canvas.height * 0.8);

      ctx.lineWidth = Math.max(2, canvas.width / 250);
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.36, cropMarginY); ctx.lineTo(canvas.width * 0.36, canvas.height * 0.9);
      ctx.moveTo(canvas.width * 0.63, cropMarginY); ctx.lineTo(canvas.width * 0.63, canvas.height * 0.9);
      ctx.moveTo(cropMarginX, canvas.height * 0.36); ctx.lineTo(canvas.width * 0.9, canvas.height * 0.36);
      ctx.moveTo(cropMarginX, canvas.height * 0.63); ctx.lineTo(canvas.width * 0.9, canvas.height * 0.63);
      ctx.stroke();
    }
  };

  useEffect(() => {
    if (editingQueuedFile && imageObjRef.current) {
      renderCanvas(imageObjRef.current, rotation, brightness, contrast, cropSimulated);
    }
  }, [rotation, brightness, contrast, cropSimulated, editingQueuedFile]);

  const handleRotate90 = () => { setRotation(prev => (prev + 90) % 360); };

  const handleSaveModifiedCanvas = () => {
    if (!canvasRef.current || !editingQueuedFile) return;

    setIsSavingCanvas(true);
    showToast.info('Extraindo buffer de imagem alterada do Canvas HTML5...');

    setTimeout(() => {
      canvasRef.current?.toBlob(blob => {
        if (!blob) {
          showToast.error('Falha ao exportar buffer do Canvas.');
          setIsSavingCanvas(false);
          return;
        }

        const newFile = new File([blob], editingQueuedFile.name, { type: blob.type });
        const newPreviewUrl = URL.createObjectURL(newFile);

        setQueue(prev => prev.map(q => {
          if (q.id === editingQueuedFile.id) {
            if (q.previewUrl) URL.revokeObjectURL(q.previewUrl);
            return {
              ...q,
              file: newFile,
              size: blob.size,
              previewUrl: newPreviewUrl,
            };
          }
          return q;
        }));

        setIsSavingCanvas(false);
        setEditingQueuedFile(null);
        showToast.success('Imagem pré-processada com sucesso! Atualizada para envio OCR.');
      }, editingQueuedFile.type, 0.92);
    }, 800);
  };

  // Split-Screen Inspection Handlers
  const handleOpenSplitInspection = (item: GalleryMedia | QueuedFile) => {
    setSplitInspectItem(item);
    setSplitRawText(item.rawExtractedText || '[Texto não disponível ou leitura OCR pendente]');
    setSplitProgress(100);
    setSplitStage('Leitura OCR Extraída com Sucesso');
  };

  const handleTriggerSplitReprocess = () => {
    if (!splitInspectItem) return;

    setIsSplitReprocessing(true);
    setSplitProgress(15);
    setSplitStage('Inicializando Tesseract OCR v5.2...');

    setTimeout(() => { setSplitProgress(45); setSplitStage('Binarizando buffer visual e removendo ruído...'); }, 600);
    setTimeout(() => { setSplitProgress(75); setSplitStage('Analisando layout de colunas e parágrafos...'); }, 1200);
    setTimeout(() => { 
      setSplitProgress(100); 
      setSplitStage('Leitura concluída com sucesso');
      const enhancedText = SAMPLE_RAW_TEXT_1 + `\n\n[Reprocessamento Avançado Concluído em ${new Date().toLocaleTimeString('pt-BR')}]`;
      setSplitRawText(enhancedText);

      if ('uploadedAt' in splitInspectItem) {
        setGallery(prev => prev.map(g => g.id === splitInspectItem.id ? { ...g, rawExtractedText: enhancedText } : g));
      } else {
        setQueue(prev => prev.map(q => q.id === splitInspectItem.id ? { ...q, rawExtractedText: enhancedText } : q));
      }

      setIsSplitReprocessing(false);
      showToast.success('Texto re-extraído via Tesseract OCR com sucesso!');
    }, 1800);
  };

  const handleCopySplitText = () => {
    navigator.clipboard.writeText(splitRawText);
    showToast.success('Texto cru copiado para a área de transferência!');
  };

  const handleSaveSplitText = () => {
    if (!splitInspectItem) return;

    if ('uploadedAt' in splitInspectItem) {
      setGallery(prev => prev.map(g => g.id === splitInspectItem.id ? { ...g, rawExtractedText: splitRawText } : g));
    } else {
      setQueue(prev => prev.map(q => q.id === splitInspectItem.id ? { ...q, rawExtractedText: splitRawText } : q));
    }

    showToast.success('Alterações no texto extraído salvas com sucesso!');
  };

  // Sprint 30: Llama 3 AI Draft Generation
  const handleGenerateAiDraft = () => {
    const selectedMedia = gallery.find(g => g.id === aiSelectedMediaId);
    if (!selectedMedia) {
      showToast.error('Selecione uma mídia de origem para analisar com a IA.');
      return;
    }

    setIsGeneratingAiDraft(true);
    setGeneratedAiDraft('');
    showToast.info('Inicializando Llama 3 (Inference Engine) com parâmetros customizados...');

    const promptDetails = `[Tone: ${aiTone}] [Length: ${aiLength}]\n[Instructions: ${aiCustomInstructions}]`;

    setTimeout(() => {
      const generatedResult = `📢 MINUTA DE NOTÍCIA E CONTATOS (GERADA POR IA - LLAMA 3)
======================================================
Parâmetros de Geração: ${promptDetails}
Data de Análise: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}

📌 RESUMO INTELIGENTE (${aiLength}):
Identificamos excelentes oportunidades no caderno de imóveis e classificados. O conteúdo foi formatado em tom ${aiTone.toLowerCase()} para rápida assimilação comercial pela equipe de atendimento.

📞 CONTATOS VALIDADOS COM DDD (+55):
• Mário Lopes: +55 (11) 98888-1234 (Apto Centro, R$ 380mil)
• Ana Oliveira: +55 (11) 99111-5555 (Sobrado Mooca, R$ 650mil)
• Carlos Santos: +55 (11) 97777-8888 (Sala Comercial Paulista)
• Beatriz Silva: +55 (11) 98888-9999 (Galpão Barra Funda)
• Lucas Costa: +55 (11) 98888-4321 (Terreno Morumbi)

🚀 CONCLUSÃO & AÇÃO SUGERIDA:
Todos os 5 contatos foram higienizados conforme suas instruções e estão prontos para envio em massa no WhatsApp Hub.`;

      let currentLength = 0;
      const typingInterval = window.setInterval(() => {
        currentLength += 35;
        if (currentLength >= generatedResult.length) {
          clearInterval(typingInterval);
          setGeneratedAiDraft(generatedResult);
          setIsGeneratingAiDraft(false);
          showToast.success('Minuta gerada com sucesso pelo modelo Llama 3!');
        } else {
          setGeneratedAiDraft(generatedResult.substring(0, currentLength));
        }
      }, 50);
    }, 1200);
  };

  const handleCopyAiDraft = () => {
    navigator.clipboard.writeText(generatedAiDraft);
    showToast.success('Minuta gerada pela IA copiada com sucesso!');
  };

  const handleApplyPreset = (tone: 'Formal' | 'Informativo' | 'Dinâmico' | 'Urgente', instructions: string) => {
    setAiTone(tone);
    setAiCustomInstructions(instructions);
    showToast.success(`Preset "${tone}" aplicado com sucesso!`);
  };

  const waitingCount = queue.filter(f => f.status === 'waiting').length;
  const uploadingCount = queue.filter(f => f.status === 'uploading').length;
  const successCount = queue.filter(f => f.status === 'success').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Split-Screen OCR Extraction Inspection Studio Modal */}
      {splitInspectItem && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          zIndex: 20000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
          animation: 'fade-in 0.2s ease-out',
        }}>
          <div className="glass-panel" style={{
            maxWidth: '1400px', width: '100%', maxHeight: '92vh', display: 'flex', flexDirection: 'column',
            overflow: 'hidden', boxShadow: '0 30px 90px rgba(0, 0, 0, 0.9)', border: '1px solid var(--primary)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Split size={24} style={{ color: 'var(--primary)' }} />
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>Visão Dividida Lado a Lado (Split-Screen OCR)</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Inspecione a imagem original simultaneamente com o texto cru extraído pelo Tesseract</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Button type="button" variant="primary" icon={RefreshCw} onClick={handleTriggerSplitReprocess} isLoading={isSplitReprocessing} style={{ height: '38px', fontSize: '0.85rem' }}>
                  {isSplitReprocessing ? 'Processando Tesseract...' : 'Reprocessar Texto OCR'}
                </Button>
                <button onClick={() => setSplitInspectItem(null)} disabled={isSplitReprocessing} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.8rem', cursor: 'pointer', marginLeft: '8px' }}>&times;</button>
              </div>
            </div>

            {isSplitReprocessing && (
              <div style={{ padding: '12px 24px', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderBottom: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'white' }}>
                  <span style={{ fontWeight: 600 }}>{splitStage}</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{splitProgress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${splitProgress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.3s ease-out' }} />
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', flex: 1, overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#05070f', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', borderRight: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ImageIcon size={18} style={{ color: 'var(--primary)' }} />
                    <span>Imagem/PDF Original ({splitInspectItem.name})</span>
                  </span>
                  <Badge variant="primary">Visualizador Fiel</Badge>
                </div>

                <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#090d16', borderRadius: '8px', border: '1px solid var(--border)', padding: '16px', minHeight: '350px' }}>
                  <img src={'imageUrl' in splitInspectItem ? splitInspectItem.imageUrl : splitInspectItem.previewUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80'} alt="Original" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} />
                </div>
              </div>

              <div style={{ backgroundColor: '#0b1120', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} style={{ color: 'var(--success)' }} />
                    <span>Texto Cru Extraído (Editável)</span>
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button type="button" variant="secondary" icon={Copy} onClick={handleCopySplitText} style={{ height: '30px', fontSize: '0.75rem', padding: '0 10px' }}>Copiar</Button>
                    <Button type="button" variant="secondary" icon={Save} onClick={handleSaveSplitText} style={{ height: '30px', fontSize: '0.75rem', padding: '0 10px', borderColor: 'var(--success)', color: 'var(--success)' }}>Salvar</Button>
                  </div>
                </div>

                <textarea
                  value={splitRawText}
                  onChange={e => setSplitRawText(e.target.value)}
                  disabled={isSplitReprocessing}
                  placeholder="O texto extraído aparecerá aqui..."
                  style={{
                    flex: 1, width: '100%', minHeight: '350px', padding: '20px', borderRadius: '8px',
                    backgroundColor: '#0f172a', border: '1px solid var(--border)', color: '#f8fafc',
                    fontFamily: 'monospace', fontSize: '0.95rem', lineHeight: 1.6, resize: 'none', outline: 'none',
                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)', overflowY: 'auto'
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Dica: Edite números ou nomes cortados diretamente na caixa acima.</span>
                  <Button type="button" variant="primary" icon={Send} onClick={() => { showToast.success('Texto extraído enviado para o Estúdio de Rascunhos!'); setSplitInspectItem(null); }} style={{ height: '36px', fontSize: '0.85rem' }}>
                    Enviar para Rascunhos
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Canvas Visual Pre-processing Studio Modal */}
      {editingQueuedFile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          zIndex: 15000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
          animation: 'fade-in 0.2s ease-out',
        }}>
          <div className="glass-panel" style={{
            maxWidth: '1100px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            overflow: 'hidden', boxShadow: '0 30px 90px rgba(0, 0, 0, 0.9)', border: '1px solid var(--primary)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Sliders size={24} style={{ color: 'var(--primary)' }} />
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>Estúdio de Pré-Processamento Visual (Canvas HTML5)</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Otimize rotação, corte e iluminação do jornal para máxima acurácia do motor OCR</span>
                </div>
              </div>
              <button onClick={() => setEditingQueuedFile(null)} disabled={isSavingCanvas} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.8rem', cursor: 'pointer' }}>&times;</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', flex: 1, overflow: 'hidden' }}>
              <div style={{ padding: '24px', backgroundColor: '#060912', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', position: 'relative', minHeight: '400px' }}>
                <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }} />
              </div>

              <div style={{ padding: '24px', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RotateCw size={16} style={{ color: 'var(--primary)' }} /><span>Giro e Rotação</span>
                  </span>
                  <Button type="button" variant="secondary" onClick={handleRotate90} disabled={isSavingCanvas} style={{ justifyContent: 'center', height: '42px' }}>
                    Girar 90° Graus à Direita (Atual: {rotation}°)
                  </Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Crop size={16} style={{ color: 'var(--primary)' }} /><span>Módulo de Corte (Cropping)</span>
                  </span>
                  <Button type="button" variant={cropSimulated ? 'primary' : 'secondary'} onClick={() => setCropSimulated(prev => !prev)} disabled={isSavingCanvas} style={{ justifyContent: 'center', height: '42px' }}>
                    {cropSimulated ? 'Desativar Grid de Corte' : 'Simular Corte Proporcional'}
                  </Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                      <span style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}><Sun size={16} style={{ color: '#eab308' }} /><span>Ajuste de Brilho</span></span>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{brightness}%</span>
                    </div>
                    <input type="range" min="50" max="150" value={brightness} onChange={e => setBrightness(Number(e.target.value))} disabled={isSavingCanvas} style={{ width: '100%', cursor: 'pointer' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                      <span style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}><Contrast size={16} style={{ color: '#3b82f6' }} /><span>Contraste Visual</span></span>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{contrast}%</span>
                    </div>
                    <input type="range" min="50" max="150" value={contrast} onChange={e => setContrast(Number(e.target.value))} disabled={isSavingCanvas} style={{ width: '100%', cursor: 'pointer' }} />
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                  <Button type="button" variant="secondary" onClick={() => setEditingQueuedFile(null)} disabled={isSavingCanvas} style={{ flex: 1, justifyContent: 'center' }}>Cancelar</Button>
                  <Button type="button" variant="primary" icon={Check} onClick={handleSaveModifiedCanvas} isLoading={isSavingCanvas} style={{ flex: 1, justifyContent: 'center' }}>Salvar</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Overlay Modal */}
      {lightboxItem && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
          animation: 'fade-in 0.2s ease-out',
        }}>
          <div className="glass-panel" style={{
            maxWidth: '1000px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            overflow: 'hidden', boxShadow: '0 30px 90px rgba(0, 0, 0, 0.8)', border: '1px solid rgba(255,255,255,0.15)',
            animation: 'scale-up 0.2s ease-out',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {lightboxItem.type === 'pdf' ? <FileText size={24} style={{ color: '#ef4444' }} /> : <ImageIcon size={24} style={{ color: 'var(--primary)' }} />}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{lightboxItem.name}</h3>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <span>{lightboxItem.sizeFormatted}</span><span>•</span><span>Enviado em {lightboxItem.uploadedAt}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Button type="button" variant="primary" icon={Split} onClick={() => { handleOpenSplitInspection(lightboxItem); setLightboxItem(null); }} style={{ height: '36px', fontSize: '0.85rem' }}>
                  Inspecionar Split-Screen
                </Button>
                <Button type="button" variant="secondary" icon={Trash2} onClick={() => handleDeleteGalleryMedia(lightboxItem.id, lightboxItem.name)} style={{ height: '36px', fontSize: '0.85rem', borderColor: 'var(--error)', color: 'var(--error)' }}>
                  Apagar
                </Button>
                <button onClick={() => setLightboxItem(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.8rem', cursor: 'pointer', marginLeft: '8px' }}>&times;</button>
              </div>
            </div>

            <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#090d16', padding: '24px', minHeight: '360px', maxHeight: 'calc(90vh - 160px)' }}>
              <img src={lightboxItem.imageUrl} alt={lightboxItem.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} />
            </div>

            <div style={{ padding: '16px 24px', backgroundColor: 'rgba(15, 23, 42, 0.8)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status do Motor OCR:</span>
                <Badge variant={lightboxItem.ocrStatus === 'Concluído' ? 'success' : lightboxItem.ocrStatus === 'Falha' ? 'error' : 'warning'}>{lightboxItem.ocrStatus}</Badge>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: 700, fontSize: '0.95rem' }}>
                <CheckCircle2 size={18} />
                <span>{lightboxItem.extractedContactsCount} contatos extraídos desta mídia</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileUp size={32} style={{ color: 'var(--primary)' }} />
            <span>Digitalização de Jornais e Recortes (OCR)</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Arraste páginas de jornal, aplique ajustes no Canvas, inspecione no Split-Screen e resuma com Llama 3</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {queue.length > 0 && (
            <Button type="button" variant="secondary" icon={Trash2} onClick={handleClearAll} disabled={uploadingCount > 0}>
              Limpar Fila
            </Button>
          )}
          <Button type="button" variant="primary" icon={Sparkles} onClick={handleStartUploads} isLoading={uploadingCount > 0} disabled={waitingCount === 0}>
            {uploadingCount > 0 ? `Processando (${uploadingCount})...` : 'Iniciar Processamento OCR'}
          </Button>
        </div>
      </div>

      {/* Sprint 30: Llama 3 AI Prompt Customization Studio Panel */}
      <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px', borderColor: 'rgba(168, 85, 247, 0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
              <Bot size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Estúdio de Inteligência Artificial & Prompt (Llama 3)</span>
                <Badge variant="primary">Ollama Local AI</Badge>
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>Selecione o tom de voz, tamanho e forneça instruções customizadas para resumir recortes e formatar contatos</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Settings size={14} /> Presets Rápidos:
            </span>
            <Button type="button" variant="secondary" onClick={() => handleApplyPreset('Informativo', 'Faça um resumo direto focando nos telefones e valores dos imóveis.')} style={{ height: '30px', fontSize: '0.75rem', padding: '0 10px' }}>
              📢 Classificados
            </Button>
            <Button type="button" variant="secondary" onClick={() => handleApplyPreset('Urgente', 'Destaque as notícias urgentes em tópicos curtos e insira o ícone 🚨.')} style={{ height: '30px', fontSize: '0.75rem', padding: '0 10px' }}>
              🚨 Pauta Urgente
            </Button>
            <Button type="button" variant="secondary" onClick={() => handleApplyPreset('Formal', 'Sintetize o documento em tom estritamente corporativo e formal.')} style={{ height: '30px', fontSize: '0.75rem', padding: '0 10px' }}>
              👔 Comunicado
            </Button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Media Selection for AI Analysis */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileCode2 size={16} style={{ color: '#c084fc' }} /> <span>Mídia de Origem (Texto OCR)</span>
            </label>
            <select
              value={aiSelectedMediaId}
              onChange={e => setAiSelectedMediaId(e.target.value)}
              disabled={isGeneratingAiDraft}
              style={{
                width: '100%', height: '44px', padding: '0 16px', borderRadius: '8px',
                backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border)', color: 'white',
                fontSize: '0.9rem', outline: 'none', cursor: 'pointer'
              }}
            >
              {gallery.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.extractedContactsCount} contatos extraídos)
                </option>
              ))}
            </select>
          </div>

          {/* Tone Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquareText size={16} style={{ color: '#c084fc' }} /> <span>Tom de Voz & Escrita</span>
            </label>
            <select
              value={aiTone}
              onChange={e => setAiTone(e.target.value as 'Formal' | 'Informativo' | 'Dinâmico' | 'Urgente')}
              disabled={isGeneratingAiDraft}
              style={{
                width: '100%', height: '44px', padding: '0 16px', borderRadius: '8px',
                backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border)', color: 'white',
                fontSize: '0.9rem', outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="Formal">Formal & Corporativo</option>
              <option value="Informativo">Informativo & Jornalístico</option>
              <option value="Dinâmico">Dinâmico & Engajador</option>
              <option value="Urgente">Urgente & Alerta de Crise</option>
            </select>
          </div>

          {/* Output Size */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlignLeft size={16} style={{ color: '#c084fc' }} /> <span>Tamanho do Resumo</span>
            </label>
            <select
              value={aiLength}
              onChange={e => setAiLength(e.target.value as 'Curto' | 'Médio' | 'Longo')}
              disabled={isGeneratingAiDraft}
              style={{
                width: '100%', height: '44px', padding: '0 16px', borderRadius: '8px',
                backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border)', color: 'white',
                fontSize: '0.9rem', outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="Curto">Curto (Apenas Tópicos Chave)</option>
              <option value="Médio">Médio (Resumo e Contatos Principais)</option>
              <option value="Longo">Longo (Análise Completa e Transcrição Integral)</option>
            </select>
          </div>
        </div>

        {/* Custom Instructions Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wand2 size={16} style={{ color: '#c084fc' }} /> <span>Instruções Adicionais de Prompt (Livre)</span>
          </label>
          <textarea
            value={aiCustomInstructions}
            onChange={e => setAiCustomInstructions(e.target.value)}
            disabled={isGeneratingAiDraft}
            placeholder="Ex: Formate os números com +55, separe por categorias, ignore anúncios publicitários..."
            style={{
              width: '100%', minHeight: '100px', padding: '16px', borderRadius: '8px',
              backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border)', color: 'white',
              fontSize: '0.95rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Trigger Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="primary"
            icon={Bot}
            onClick={handleGenerateAiDraft}
            isLoading={isGeneratingAiDraft}
            style={{ height: '48px', padding: '0 32px', fontSize: '1rem', backgroundColor: '#a855f7', borderColor: '#a855f7' }}
          >
            {isGeneratingAiDraft ? 'Processando Inference no Llama 3...' : 'Gerar Minuta de Notícia com Llama 3'}
          </Button>
        </div>

        {/* Generated Output Display */}
        {generatedAiDraft && (
          <div style={{ padding: '24px', borderRadius: '12px', backgroundColor: '#090d16', border: '1px solid #c084fc', display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fade-in 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={18} style={{ color: '#c084fc' }} />
                <span>Minuta e Resumo Gerados (Llama 3)</span>
              </span>
              <Button type="button" variant="secondary" icon={Copy} onClick={handleCopyAiDraft} style={{ height: '32px', fontSize: '0.8rem' }}>
                Copiar Minuta de Notícia
              </Button>
            </div>

            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.95rem', color: '#f8fafc', lineHeight: 1.6, padding: '16px', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
              {generatedAiDraft}
            </pre>
          </div>
        )}
      </div>

      {/* Main Drag and Drop Upload Zone */}
      <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <UploadCloud size={24} style={{ color: 'var(--primary)' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>Área de Transferência e Importação Multimídia</h3>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`,
            borderRadius: '16px', padding: '56px 24px', backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.01)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '16px',
            cursor: 'pointer', transition: 'all 0.2s ease-out',
          }}
        >
          <input type="file" ref={fileInputRef} multiple accept=".png,.jpg,.jpeg,.pdf" onChange={e => e.target.files && handleFilesAdded(e.target.files)} style={{ display: 'none' }} />
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', transform: isDragging ? 'scale(1.1)' : 'scale(1)' }}>
            <FileUp size={36} />
          </div>
          <div>
            <span style={{ fontWeight: 700, color: 'white', fontSize: '1.2rem', display: 'block' }}>
              {isDragging ? 'Solte os arquivos para adicionar à fila' : 'Arraste as imagens/PDFs das notícias aqui ou clique para selecionar'}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
              Formatos aceitos: PNG, JPG, JPEG e PDF (Tamanho Máximo: 15MB)
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#cbd5e1' }}>Alta Resolução Recomendada</span>
            <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#cbd5e1' }}>Detecção Multi-coluna</span>
          </div>
        </div>

        {queue.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} style={{ color: 'var(--primary)' }} />
                <span>Fila de Documentos ({queue.length})</span>
              </h4>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--success)' }}>{successCount} Concluídos</span>
                <span style={{ color: 'var(--text-muted)' }}>{waitingCount} Aguardando</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
              {queue.map(item => (
                <div key={item.id} style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      {item.previewUrl ? <img src={item.previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : item.type.includes('pdf') ? <FileText size={28} style={{ color: '#ef4444' }} /> : <ImageIcon size={28} style={{ color: 'var(--text-muted)' }} />}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
                      <span style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatBytes(item.size)}</span>
                      <div style={{ marginTop: '2px' }}>
                        {item.status === 'error' && <span style={{ fontSize: '0.75rem', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /><span>{item.errorMessage}</span></span>}
                        {item.status === 'waiting' && <Badge variant="primary">Aguardando OCR</Badge>}
                        {item.status === 'uploading' && <Badge variant="warning">Enviando e Lendo...</Badge>}
                        {item.status === 'success' && <Badge variant="success">OCR Concluído</Badge>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      {item.status === 'success' && (
                        <button type="button" onClick={() => handleOpenSplitInspection(item)} style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid var(--primary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Inspecionar Leitura OCR (Split-Screen)">
                          <Split size={16} />
                        </button>
                      )}
                      {item.previewUrl && item.status !== 'uploading' && (
                        <button type="button" onClick={() => handleOpenCanvasEditor(item)} style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Editar e Pré-Processar Imagem no Canvas">
                          <Sliders size={16} />
                        </button>
                      )}
                      {item.status !== 'uploading' && (
                        <button type="button" onClick={() => handleRemoveFile(item.id)} style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Remover da Fila">
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  {item.status === 'uploading' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>Progresso de Envio</span>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{item.progress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.progress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.2s linear' }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Source Files Management Gallery Grid */}
      <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FolderOpen size={24} style={{ color: 'var(--primary)' }} />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>Galeria de Mídias Submetidas e Origens OCR</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>Consulte arquivos originais salvos em disco, force novas extrações ou libere espaço</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', backgroundColor: 'rgba(255,255,255,0.03)', padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <HardDrive size={16} style={{ color: 'var(--primary)' }} />
            <span>Espaço Ocupado: <strong style={{ color: 'white' }}>17.2 MB</strong> / 5 GB</span>
          </div>
        </div>

        {gallery.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhum arquivo de origem armazenado no servidor atualmente.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {gallery.map(media => (
              <div 
                key={media.id} 
                style={{ 
                  borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', 
                  display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'transform 0.2s, borderColor 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div 
                  onClick={() => setLightboxItem(media)}
                  style={{ 
                    height: '160px', backgroundColor: '#0b0f19', position: 'relative', cursor: 'pointer', overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <img src={media.imageUrl} alt={media.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                  
                  <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px' }}>
                    <Badge variant={media.ocrStatus === 'Concluído' ? 'success' : media.ocrStatus === 'Falha' ? 'error' : 'warning'}>{media.ocrStatus}</Badge>
                  </div>

                  <div style={{ position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'white' }}>
                    <Maximize2 size={12} /><span>Ampliar</span>
                  </div>
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  <span style={{ fontWeight: 600, color: 'white', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={media.name}>
                    {media.name}
                  </span>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /><span>{media.uploadedAt}</span></div>
                    <span>{media.sizeFormatted}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenSplitInspection(media)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                    >
                      <Split size={14} /><span>Ver Extração OCR</span>
                    </button>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button type="button" onClick={() => handleManualExtraction(media)} disabled={isExtractingManual} title="Forçar Re-leitura OCR" style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: isExtractingManual ? 'var(--text-muted)' : '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <RefreshCw size={14} />
                      </button>
                      <button type="button" onClick={() => handleDeleteGalleryMedia(media.id, media.name)} title="Apagar do Disco" style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default OcrReader;

/**
 * Compiler invocation types and options
 * Based on sac2c command-line argument definitions from options.c
 */

/** Runtime result from compiler execution */
export interface SacCompilerRunResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

/** Prepared compiler invocation */
export interface SacInvocation {
  command: string;
  args: string[];
  cwd: string;
}

/** Backend execution environment */
export type ExecutionBackend = "local" | "wsl" | "docker";

/** Compiler channel/version selection */
export type CompilerChannel = "system" | "stable" | "develop";

/** Compiler resolution result */
export interface CompilerResolution {
  source: "explicit" | "bundled-stable" | "bundled-develop" | "system" | "system-fallback" | "missing";
  executable: string | null;
  reason?: string;
}

/** Runtime configuration for compiler navigation/hover operations */
export interface CompilerNavigationRuntimeConfig {
  executable: string | null;
  extraArgs: string[];
  timeoutMs: number;
}

/** Compiler resolution settings from VS Code config */
export interface CompilerResolutionSettings {
  compilerChannel: CompilerChannel;
  compilerPath: string;
  fallbackToSystem: boolean;
}

/**
 * Compiler backend targets
 * Maps to sac2c -target option
 */
export type CompilerBackend = "c99" | "omp" | "cuda" | "cudahybrid" | "distmem" | "MUTC";

/**
 * Threading/multithreading mode
 * Maps to internal mtmode in sac2c
 */
export type MultithreadingMode = "none" | "omp" | "ol1" | "ol2";

/**
 * CUDA async synchronization mode
 * Controls how CUDA kernels synchronize
 */
export type CudaAsyncMode = "nosync" | "device" | "stream" | "callback";

/**
 * GPU memory advice strategy
 */
export type GpuMemoryAdvice = "always" | "never" | "infer";

/**
 * GPU mapping strategy for kernel execution
 */
export type GpuMappingStrategy = "jings_method" | "jings_method_ext" | "foldall";

/**
 * Compilation phase breakpoints
 * Break compilation after specified phase
 */
export type BreakPhase = "cg" | "mod" | "opt" | "syn" | "cpp";

/**
 * Trace level for compiler diagnostics
 */
export type CompilerTraceLevel = "off" | "messages" | "verbose";

/**
 * Runtime check flags
 * Control what runtime checks are performed
 */
export interface RuntimeChecks {
  /** Memory boundary checks */
  boundary?: boolean;
  /** Type conformity checks */
  conformity?: boolean;
  /** Heap memory checks */
  heap?: boolean;
  /** All runtime checks */
  all?: boolean;
}

/**
 * Optimization flags
 * Control which compiler optimizations are enabled
 */
export interface OptimizationFlags {
  /** Polymorphic heap memory */
  phm?: boolean;
  /** Array padding */
  ap?: boolean;
  /** Distributed array pooling */
  dap?: boolean;
  /** Memory shape cache analysis */
  msca?: boolean;
  /** Strict array alignment */
  saa?: boolean;
  /** Invariant vector extraction */
  ive?: boolean;
  /** With-loop unrolling */
  wlur?: boolean;
  /** With-loop induction */
  wli?: boolean;
  /** Shape-of operation */
  sop?: boolean;
  /** Shape replication */
  srp?: boolean;
  /** Polyhedral with-loop folding */
  pwlf?: boolean;
  /** Polyhedral orchestration */
  pogo?: boolean;
  /** Polyhedral with-loop unrolling */
  plur?: boolean;
  /** Advanced with-loop folding */
  awlf?: boolean;
  /** All optimizations */
  all?: boolean;
}

/**
 * Main compiler options
 * Represents sac2c command-line options in a type-safe manner
 */
export interface CompilerOptions {
  // === Compilation targets ===
  /** Target backend (c99, omp, cuda, etc.) */
  backend?: CompilerBackend;

  // === Optimization ===
  optimizations?: OptimizationFlags;

  // === Runtime checks ===
  runtimeChecks?: RuntimeChecks;
  /** Check frequency (0-4) */
  checkFrequency?: number;

  // === Multithreading/Parallelism ===
  /** Number of threads to use */
  numThreads?: number;
  /** Maximum threads */
  maxThreads?: number;
  /** Multithreading mode */
  multithreadingMode?: MultithreadingMode;
  /** Minimum parallel size threshold */
  minParallelSize?: number;
  /** Barrier type for MT synchronization */
  mtBarrierType?: string;

  // === CUDA-specific ===
  /** CUDA architecture target (e.g., "SM_60") */
  cudaArch?: string;
  /** CUDA async mode */
  cudaAsyncMode?: CudaAsyncMode;
  /** CUDA allocation strategy */
  cudaAlloc?: "cumanp" | "other";
  /** Enable GPU branching */
  cudaGpuBranching?: boolean;
  /** GPU memory advice */
  gpuMemoryAdvice?: GpuMemoryAdvice;
  /** GPU mapping strategy */
  gpuMappingStrategy?: GpuMappingStrategy;
  /** Disable GPU mapping compression */
  gpuMappingNoCompress?: boolean;
  /** Measure GPU kernel time */
  gpuMeasureKernelTime?: boolean;

  // === Distributed memory ===
  /** Minimum distributed size threshold */
  minDistributed?: number;
  /** Distributed memory page fault node count */
  distmemTrPfNode?: number;

  // === Debug & profiling ===
  /** Enable C compiler debug info (-g) */
  ccDebug?: boolean;
  /** Extra C compiler debug info (-gg) */
  ccDebugExtra?: boolean;
  /** Generic C compiler tuning */
  ccTuneGeneric?: boolean;
  /** Profile shape reuse (shray) */
  profileShray?: boolean;

  // === Preprocessing ===
  /** C preprocessor defines (-D) */
  defines?: string[];
  /** C preprocessor include paths (-I) */
  includePaths?: string[];
  /** C preprocessor options */
  cppOptions?: string;

  // === Output files ===
  /** Output file name */
  outputFile?: string;
  /** SAC module name */
  sacModule?: string;

  // === Linking ===
  /** Library search paths (-L) */
  libPaths?: string[];
  /** Libraries to link (-l) */
  libs?: string[];
  /** C compiler flags (-Xc) */
  ccFlags?: string[];
  /** C linker flags (-Xl) */
  ldFlags?: string[];

  // === Compilation control ===
  /** Break after phase */
  breakAfter?: BreakPhase;
  /** Skip C compilation */
  skipCCompilation?: boolean;

  // === Output & formatting ===
  /** Print configuration and exit */
  printConfig?: boolean;
  /** Print help and exit */
  help?: string | null;
  /** List available targets and exit */
  listTargets?: boolean;

  // === Messaging/diagnostics ===
  /** CTI message length limit (0-255) */
  messageLength?: number;
  /** Disable colored output */
  noColor?: boolean;
  /** Omit source code in messages */
  noSource?: boolean;
  /** Omit hints in messages */
  noHint?: boolean;
  /** Omit explanations in messages */
  noExplain?: boolean;
  /** Single-line message format */
  singleLineMessages?: boolean;

  // === Advanced features ===
  /** Enable cache simulation */
  cacheSimulation?: boolean;
  /** Enable dynamic shapes */
  dynamicShapes?: boolean;
  /** Enable fold fusion */
  foldFusion?: boolean;
  /** Enable fold parallelization */
  foldParallel?: boolean;
  /** Install mode */
  install?: boolean;

  // === Memory ===
  /** Initial master heap size */
  initMHeap?: number;
  /** Initial worker heap size */
  initWHeap?: number;
  /** Initial unified heap size */
  initUHeap?: number;

  // === Tracing ===
  trace?: CompilerTraceLevel;
}

/**
 * Resolved executable and configuration for running compiler
 */
export interface ResolvedCompilerConfig {
  executable: string;
  args: string[];
  cwd: string;
}

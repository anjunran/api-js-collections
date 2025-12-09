//Nom du projet: MetroCanicJS

const MetroCanicJS = (arr = [], a = []) => {
  //arr, a :
  //1. arr , est un array de stockage des "timestamp" dans la methode tap() "core".
  //2. a : est un array de stockage des "duration (const e = arr[t + 1] - arr[t])" dans la methode tap() "core".
  //Method tap(): consiste a calculer automatiquement la vitesse du rythme musical par utilisation des evenement "click" en front-end.
  let intervalID;

  // Verifier si un input est un Objet;
  function isObject(input) {
    return (
      input != null &&
      Object.prototype.toString.call(input) === "[object Object]"
    );
  }

  //Verifier si un input est un Array
  function isArray(input) {
    return (
      input instanceof Array ||
      Object.prototype.toString.call(input) === "[object Array]"
    );
  }

  // Verifier si un Array n'est pas vide;
  function isNotUndefinedOrEmpty(arr) {
    return isArray(arr) ? arr.length > 0 : false;
  }

  // Definir les valeur initial des proprietes du metronome quand les Objets sont entrees dans le parametre "cs",
  // si les parametres sont vides - appliquer des valeurs par defaut,

  function isObjectGetVal(ivalue, name) {
    const { dcount, dbars, dbeat, dbpm, dtapMode } = {
      dcount: 1,
      dbars: 0,
      dbeat: 4,
      dbpm: 120,
      dtapMode: false,
    };

    switch (name) {
      case "count":
        return isObject(ivalue) &&
          Object.prototype.hasOwnProperty.call(ivalue, name)
          ? ivalue.count
          : dcount;
      case "bpm":
        return isObject(ivalue) &&
          Object.prototype.hasOwnProperty.call(ivalue, name)
          ? ivalue.bpm
          : dbpm;
      case "beat":
        return isObject(ivalue) &&
          Object.prototype.hasOwnProperty.call(ivalue, name)
          ? ivalue.beat
          : dbeat;
      case "bars":
        return isObject(ivalue) &&
          Object.prototype.hasOwnProperty.call(ivalue, name)
          ? ivalue.bars
          : dbars;
      case "tapMode":
        return isObject(ivalue) &&
          Object.prototype.hasOwnProperty.call(ivalue, name)
          ? ivalue.tapMode
          : dtapMode;
      default:
        break;
    }
  }

  // PARTIE A: Object Constructor "METRONOMECONSTRUCTOR" || DATAS du Metronome;
  // lexiques :
  //| count : compteur du metronome | bars : nombre mesure ou duree complet compté | beat : valeur de temps ex. comme dans les partitions 4/4, 3/4 ...| bpm : nombre de count / minute | tapMode : Boolean, passer en mode Tap, reglage de vitesse manuellement.

  function METRONOMECONSTRUCTOR(initialvalue) {
    this.count = isObjectGetVal(initialvalue, "count");
    this.bpm = isObjectGetVal(initialvalue, "bpm");
    this.beat = isObjectGetVal(initialvalue, "beat");
    this.bars = isObjectGetVal(initialvalue, "bars");
    this.tapMode = isObjectGetVal(initialvalue, "tapMode");
  }

  //METHODES POUR PERSONNALISER LES PROPRIETES DU "METRONOMECONSTRUCTOR"
  //Prototype : remplace la valeur de "count" par input
  (METRONOMECONSTRUCTOR.prototype.SETCOUNT = function (input) {
    this.count = input;
  }),
    //Prototype : remplace la valeur de "bpm" par input
    (METRONOMECONSTRUCTOR.prototype.SETBPM = function (input) {
      this.bpm = input;
    }),
    //Prototype : remplace la valeur de "beat" par input
    (METRONOMECONSTRUCTOR.prototype.SETBEAT = function (input) {
      this.beat = input;
    }),
    //Prototype : remplace la valeur de "bars" par input
    (METRONOMECONSTRUCTOR.prototype.SETBARS = function (input) {
      this.bars = input;
    }),
    //Prototype : remplace la valeur de "tapMode" par input
    (METRONOMECONSTRUCTOR.prototype.SETTAPMODE = function (input) {
      this.tapMode = input;
    });

  // Prototypes : change le status du Metronome;
  //1. Valeur par defaut du Status.
  (METRONOMECONSTRUCTOR.prototype.DEFAULTSTATUS = function () {
    return this.STATUSTYPES[0];
  }),
    //2. Methode update du status du Metronome.
    (METRONOMECONSTRUCTOR.prototype.statusupdateSETTER = function (index) {
      if (typeof index === "string")
        switch (index) {
          case "play":
            return this.STATUSTYPES[1];

          case "stop":
            return this.STATUSTYPES[2];

          case "resume":
            return this.STATUSTYPES[3];

          case "pause":
            return this.STATUSTYPES[4];

          default:
            return this.STATUSTYPES[0];
        }
    }),
    //Liste des status valables
    (METRONOMECONSTRUCTOR.prototype.STATUSTYPES = [
      { NAME: "IDLE", STATE: 1 },
      { NAME: "PLAY", STATE: 1e1 },
      { NAME: "STOP", STATE: 1e2 },
      { NAME: "RESUME", STATE: 1e1 - 1e3 },
      { NAME: "PAUSE", STATE: 1e4 },
    ]);

  //Enclenchement du compteur et increment des datas
  (METRONOMECONSTRUCTOR.prototype.ONSET = function (core) {
    core.count < core.beat ? core.count++ : ((core.count = 1), core.bars++);
  }),
    //Stopper le metronome sans reinitialiser les datas
    (METRONOMECONSTRUCTOR.prototype.BREAK = function (intid) {
      clearInterval(intid);
    }),
    //Stopper le metronome et reinitialiser les datas
    (METRONOMECONSTRUCTOR.prototype.TERMINATE = function (intid) {
      this.BREAK(intid), this.SETCOUNT(1), this.SETBARS(0);
    });

  //CAPTURE - DATAS METRONOME
  // specifier les inputs a capturer
  (METRONOMECONSTRUCTOR.prototype.DISPLAY_THREADS = function ([
    metronome = async () => {},
    bpm = async () => {},
    beat = async () => {},
    bars = async () => {},
    OA = async () => {},
  ]) {
    //capture des datas un par un
    metronome({ data: this.count, s: this.status["NAME"] }),
      bpm({ data: this.bpm, s: this.status["NAME"] }),
      beat({ data: this.beat, s: this.status["NAME"] }),
      bars({ data: this.bars, s: this.status["NAME"] }),
      //capture des datas globals
      OA({
        beat: this.beat,
        bpm: this.bpm,
        count: this.count,
        bar: this.bars,
        s: this.status["NAME"],
        m: this.tapMode,
      });
  }),
    //Specification des "function" de capture
    (METRONOMECONSTRUCTOR.prototype.CountCore = void 0),
    (METRONOMECONSTRUCTOR.prototype.BpmCore = void 0),
    (METRONOMECONSTRUCTOR.prototype.BeatCore = void 0),
    (METRONOMECONSTRUCTOR.prototype.BarsCore = void 0),
    (METRONOMECONSTRUCTOR.prototype.OVERALL = void 0),
    //Appliquer la fonction DISPLAYTHREADS sur les fonctions de capture
    (METRONOMECONSTRUCTOR.prototype.SDTS = function () {
      this.DISPLAY_THREADS([
        this.CountCore,
        this.BpmCore,
        this.BeatCore,
        this.BarsCore,
        this.OVERALL,
      ]);
    }),
    //Blocs de personnalisation des fonctions de capture selon les besoins du developpeur
    (METRONOMECONSTRUCTOR.prototype.REALTIMEDATASLISTNER = function (
      eventName,
      clback
    ) {
      if (void 0 !== clback && clback instanceof Function) {
        switch (eventName) {
          case "bpm":
            this.BpmCore = clback;
            break;
          case "beat":
            this.BeatCore = clback;
            break;
          case "bar":
            this.BarsCore = clback;
            break;
          case "all":
            this.OVERALL = clback;
            break;
          case "count":
            this.CountCore = clback;
            break;

          default:
            return;
        }
      }
      return;
    });

  //CAPTURE - CHANGEMENT DE STATUS
  // declarer la methode de capture
  (METRONOMECONSTRUCTOR.prototype.CLUSER_CALLBACK = void 0),
    //Specifier les inputs a capturer
    (METRONOMECONSTRUCTOR.prototype.CLCOLLECT_IO = function (
      cl = async () => {}
    ) {
      if (void 0 !== cl) cl({ state: this.status["NAME"] });
      return;
    }),
    //Collecter les inputs
    (METRONOMECONSTRUCTOR.prototype.GETSTATUSCHANGE = function () {
      this.CLCOLLECT_IO(this.CLUSER_CALLBACK);
    });

  //SPEED du metronome
  METRONOMECONSTRUCTOR.prototype.speedInMs = function (bpm) {
    return 6e4 / bpm;
  };

  //PARTIE B: Object Constructor "TIMECORE" || DATAS de Rythm musical;
  function TIMECORE(b) {
    //Configuration des temps valables au parametre initiale
    this.BEAT = isNotUndefinedOrEmpty(b)
      ? isArray(b)
        ? b
        : [].concat(b)
      : [1];
    this.isBinaryByDefault = true;
  }
  //Liste des figures de rythme
  TIMECORE.prototype.STANDARDPULSATION = [
    {
      n: "breve",
      f: "double-ronde",
      u: 0.5,
      s: "𝅜",
      unicode: "U+1D15C",
      get pulse() {
        return 1 / this.u;
      },
    },
    {
      n: "semibreve",
      f: "ronde",
      u: 1,
      s: "𝅝",
      unicode: "U+1D15D",
      get pulse() {
        return 1 / this.u;
      },
    },
    {
      n: "minim",
      f: "blanche",
      u: 2,
      s: "𝅗𝅥",
      unicode: "U+1D15E",
      get pulse() {
        return 1 / this.u;
      },
    },
    {
      n: "crotchet",
      f: "noire",
      u: 4,
      s: "𝅘𝅥",
      unicode: "U+1D15F",
      get pulse() {
        return 1 / this.u;
      },
    },
    {
      n: "quaver",
      f: "croche",
      u: 8,
      s: "𝅘𝅥𝅮",
      unicode: "U+1D160",
      get pulse() {
        return 1 / this.u;
      },
    },
    {
      n: "semiquaver",
      f: "double-croche",
      u: 16,
      s: "𝅘𝅥𝅯",
      unicode: "U+1D161",
      get pulse() {
        return 1 / this.u;
      },
    },
    {
      n: "demisemiquaver",
      f: "triple-croche",
      u: 32,
      s: "𝅘𝅥𝅰",
      unicode: "U+1D162",
      get pulse() {
        return 1 / this.u;
      },
    },
    {
      n: "hemidemisemiquaver",
      f: "quadruple-croche",
      u: 64,
      s: "𝅘𝅥𝅱",
      unicode: "U+1D163",
      get pulse() {
        return 1 / this.u;
      },
    },
    {
      n: "quasihemidemisemiquaver",
      f: "quintuple-croche",
      u: 128,
      s: "𝅘𝅥𝅲",
      unicode: "U+1D164",
      get pulse() {
        return 1 / this.u;
      },
    },
  ];

  // Liste des temps binaires ou temps divisible par 2..
  TIMECORE.prototype.getBinTime = function () {
    const b = this.BEAT;

    const timepulse = this.STANDARDPULSATION;
    const btime = b.map((beat) => {
      const n = [];
      if (isArray(timepulse))
        for (el in timepulse) {
          const {
            u: divisor,
            pulse: pulse,
            s: symbol,
          } = isObject(timepulse[el]) ? timepulse[el] : null;
          const output = new Object();
          const measure = `${beat}/${divisor}`;
          Object.defineProperties(output, {
            bar: {
              get: function () {
                return measure;
              },
            },
            pertime: {
              get: function () {
                return [].concat(pulse);
              },
            },
            tellme: {
              get: function () {
                const text = `|${this.bar}| - Binary Time : 1 beat = ${this.pertime.length} <span style="font-size: larger;">${symbol}</span> / 1 whole measure = ${beat} <span style="font-size: larger;">${symbol}</span>`;
                return text;
              },
            },
            count: {
              get: function () {
                const t = [];
                for (let n = 1; n <= beat; n++) t.push(n);
                return t;
              },
            },
            high: {
              get: function () {
                return this.count[0];
              },
            },
            low: {
              get: function () {
                return this.count.slice(1).length === 0
                  ? null
                  : this.count.slice(1);
              },
            },
          });
          n.push(output);
        }
      return n.slice(1, 8);
    });
    return btime;
  };

  //liste des temps ternaire ou temps divisible par 3...
  TIMECORE.prototype.getTerTime = function () {
    const b = this.BEAT.map((beat) => 3 * beat);
    const timepulse = this.STANDARDPULSATION;
    const ttime = b.map((beat) => {
      const n = [];
      if (isArray(timepulse))
        for (el in timepulse) {
          const {
            u: divisor,
            pulse: pulse,
            s: symbol,
          } = isObject(timepulse[el]) ? timepulse[el] : null;
          const output = new Object();
          const measure = `${beat}/${divisor}`;
          Object.defineProperties(output, {
            bar: {
              get: function () {
                return measure;
              },
            },
            pertime: {
              get: function () {
                return [].concat(pulse).concat(pulse).concat(pulse);
              },
            },
            tellme: {
              get: function () {
                const twicedivisor = timepulse.filter(
                  (tpulse) => tpulse.u == divisor / 2
                );
                const text = `|${
                  this.bar
                }| - Ternary Time : 1 beat = 1 <span style="font-size: larger;">${
                  twicedivisor[0].s
                }+${symbol}</span> and can be divided into ${
                  this.pertime.length
                } <span style="font-size: larger;">${symbol}</span>; 1 whole measure = ${
                  beat / 3
                } <span style="font-size: larger;">${
                  twicedivisor[0].s
                }+${symbol}</span>, so can hold ${
                  (beat / 3) * this.pertime.length
                } <span style="font-size: larger;">${symbol}</span>;`;
                return text;
              },
            },
            count: {
              get: function () {
                const t = [];
                for (let n = 1; n <= beat / 3; n++) t.push(n);
                return t;
              },
            },
            high: {
              get: function () {
                return this.count[0];
              },
            },
            low: {
              get: function () {
                return this.count.slice(1).length === 0
                  ? null
                  : this.count.slice(1);
              },
            },
          });
          n.push(output);
        }
      return n.slice(2);
    });
    return ttime;
  };

  //Changer la valeur de la propriete BEAT
  TIMECORE.prototype.setBeat = function (input) {
    this.BEAT = [].concat(input);
  };
  //Changer la valeur de prop isBinaryByDefault
  TIMECORE.prototype.setIsBinaryByDefault = function (input) {
    this.isBinaryByDefault = input;
  };

  //Filtrer la liste par un nom de mesure ex: 4/2 1/8 4/4
  TIMECORE.prototype.useSortFilterByString = function (filter) {
    if (void 0 !== filter)
      return !0 === [/\d+/g, /\d+\/\d+/g][1].test(filter) &&
        "string" == typeof filter
        ? filter
        : isArray(filter) && 2 === filter.length
        ? `${filter[0]}/${filter[1]}`
        : `${filter.time}/${filter.unit}`;
  };

  //Assemble les mesures binaire et ternaire dans une seule liste
  TIMECORE.prototype.fetchAll = function () {
    const combolist = this.getBinTime().concat(this.getTerTime());
    const n = [];
    for (arr in combolist) {
      const cl = combolist[arr].map((combo) => {
        return {
          bar: combo.bar,
          count: combo.count,
          high: combo.high,
          low: combo.low,
          pertime: combo.pertime,
          tellme: combo.tellme,
        };
      });
      n.push(cl);
    }
    return JSON.stringify(n)
      .match(/([{])(.*?)([}])/g)
      .map((t) => JSON.parse(t));
  };

  //Sort les mesures specifiee dans l'input par son type : binaire ou ternaire.
  TIMECORE.prototype.sortMeasureByBinaryOrTernary = function (
    barString,
    { type: type },
    e = (t) => ("binary" === t ? 0 : 1)
  ) {
    const list = this.fetchAll().filter(
      (time) => time.bar === this.useSortFilterByString(barString)
    );
    return void 0 !== list[e(type)]
      ? void 0 !== type
        ? list[e(type)]
        : list
      : null;
  };

  //Definir les proprietes de Object "core" - commandes du metronome
  const metronomeCoreDefineProperties = function (mCore) {
    if (isObject(mCore))
      Object.defineProperties(mCore, {
        play: {
          value: function () {
            if (this.status !== this.STATUSTYPES[1]) {
              this.statusupdate =
                this.status === this.STATUSTYPES[4] ? "resume" : "play";
              const speed = Math.floor(this.speedInMs(this.bpm));
              intervalID = setInterval(() => {
                this.SDTS(), this.ONSET(this);
              }, speed);
              if (void 0 !== this.CLUSER_CALLBACK) this.GETSTATUSCHANGE();
            }
          },
        },
        stop: {
          value: function () {
            this.status !== this.STATUSTYPES[2] && (this.statusupdate = "stop"),
              this.TERMINATE(intervalID);
            if (void 0 !== this.CLUSER_CALLBACK) this.GETSTATUSCHANGE();
          },
        },
        resume: {
          value: function () {
            if (this.status !== this.STATUSTYPES[2])
              (this.status === this.STATUSTYPES[4]) *
                (this.status !== this.STATUSTYPES[3]) && this.play();
          },
        },
        pause: {
          value: function () {
            if (this.status !== this.STATUSTYPES[4])
              (this.statusupdate = "pause"), this.BREAK(intervalID);
            if (void 0 !== this.CLUSER_CALLBACK) this.GETSTATUSCHANGE();
          },
        },
        status: {
          value: function () {
            return this.DEFAULTSTATUS();
          },
          writable: true,
        },
        statusupdate: {
          set: function (input) {
            this.status = this.statusupdateSETTER(input);
          },
        },
        onRunStatusChange: {
          value: function (cb) {
            if (void 0 !== cb) this.CLUSER_CALLBACK = cb;
          },
        },
        realTimeBarStateFetch: {
          value: function (cb) {
            if (void 0 !== cb) this.REALTIMEDATASLISTNER("bar", cb);
          },
        },
        realtimeCountStateFetch: {
          value: function (cb) {
            if (void 0 !== cb) this.REALTIMEDATASLISTNER("count", cb);
          },
        },
        realTimeFetchAllStates: {
          value: function (cb) {
            if (void 0 !== cb) this.REALTIMEDATASLISTNER("all", cb);
          },
        },
        tap: {
          value: function (t) {
            const r = this.beat,
              m = this.tapMode;
            if (
              (arr.length === r && (arr.length = []),
              arr.push(t.timeStamp),
              arr.length === r)
            ) {
              if (false === m) this.SETTAPMODE(true);
              for (let t = 0; t < arr.length - 1; t++) {
                a.length === r - 1 && (a = []);
                const e = arr[t + 1] - arr[t];
                a.push(e);
              }
              const t = Math.floor(a.reduce((t, r) => t + r)),
                e = Math.floor(6e4 / Math.floor(t / arr.length));
              if (e > 220) {
                this.SETBPM(220);
              }
              if (e < 40) {
                this.SETBPM(40);
              }
              if (e > 40 && e < 220) {
                this.SETBPM(e);
              }
              setTimeout(() => {
                this.play();
              }, 600);
            }
          },
        },
      });
  };

  const _CORE_ = function (parameters) {
    const metronome = new METRONOMECONSTRUCTOR(parameters);
    metronomeCoreDefineProperties(metronome);
    return metronome;
  };

  const _TIMECORE_ = function (parameters) {
    const _timecore_ = new TIMECORE(parameters);
    return _timecore_;
  };

  //Objet API
  function MetroCanicJsAPI() {
    this.cs = undefined;
    this.tcs = undefined;
    this.core = function () {
      return _CORE_(this.cs);
    };
    this.timecore = function () {
      return _TIMECORE_(this.tcs);
    };
  }

  //configuration valeur initial d'input
  MetroCanicJsAPI.prototype.SetCoreObjectConfig = function (input) {
    this.cs = isObject(input) ? input : undefined;
  };

  MetroCanicJsAPI.prototype.SetTimeArrayConfig = function (input) {
    this.tcs = isArray(input) ? input : undefined;
  };

  return new MetroCanicJsAPI();
};

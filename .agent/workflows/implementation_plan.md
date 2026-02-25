# Piano di Implementazione - ArmIn

Questo documento delinea i passaggi per lo sviluppo dell'applicazione di gestione armamenti.

## Fase 1: Setup Progetto
- [ ] Inizializzazione progetto Next.js con Tailwind CSS.
- [ ] Configurazione Neon DB e Prisma/Drizzle.
- [ ] Setup del design system (colori, tipografia).

## Fase 2: Sviluppo Database e API
- [ ] Definizione degli schemi per Governi, Armi, Equipaggiamento e Transazioni.
- [ ] Implementazione delle Server Actions per le operazioni di registrazione.
- [ ] Creazione dei filtri per la ricerca del catalogo.

## Fase 3: Sviluppo UI
- [ ] Layout principale con navigazione.
- [ ] Pagina di registrazione per Governi, Armi ed Equipaggiamento.
- [ ] Dashboard delle transazioni (Vendite, Consegne, ecc.).
- [ ] Vista catalogo con filtri per categoria, tipo e marca.

## Fase 4: Logica di Business
- [ ] Gestione degli stati delle armi (una riparazione cambia lo stato in 'In Riparazione').
- [ ] Validazione dei dati per le transazioni internazionali.

## Fase 5: Raffinamento e Design
- [ ] Implementazione di estetica premium (Dark mode, animazioni Framer Motion).
- [ ] Ottimizzazione performance.

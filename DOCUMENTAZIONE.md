# Specifiche Tecniche e Funzionali - ArmIn

Sistema di gestione per la vendita e il tracciamento di armi ed equipaggiamento militare per governi.

## 1. Visione del Progetto
L'applicazione "ArmIn" è progettata per fornire una piattaforma sicura e centralizzata per i governi per gestire l'intero ciclo di vita degli armamenti e dell'equipaggiamento militare, dalla vendita iniziale alla manutenzione, fino alla distruzione o donazione.

## 2. Stack Tecnologico
- **Frontend & Backend**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Database**: Neon DB (Serverless PostgreSQL)
- **ORM**: Prisma o Drizzle (per l'interfacciamento con Neon DB)
- **Autenticazione**: NextAuth.js o Clerk (opzionale, ma consigliato per contesti governativi)

## 3. Requisiti Funzionali

### 3.1 Registrazione Entità
- **Governi**: Gestione dell'anagrafica dei governi partner (Nome Paese, Ministero di riferimento, Contatti ufficiali).
- **Armi**: Registrazione dettagliata di armi (Matricola, Modello, Produttore, Categoria).
- **Equipaggiamento**: Registrazione di forniture militari non letali (Giubbotti, visori, veicoli leggeri, ecc.).

### 3.2 Workflow e Operazioni
Il sistema deve tracciare le seguenti operazioni:
- **Vendita**: Registrazione del contratto di vendita tra fornitore e governo.
- **Consegna**: Tracciamento della spedizione e della logistica verso il destinatario.
- **Ricezione**: Conferma di avvenuta ricezione da parte del governo.
- **Restituzione**: Gestione del reso di materiali (es. fine leasing o eccedenze).
- **Riparazione**: Tracciamento dell'invio in assistenza e del rientro in servizio.
- **Sostituzione**: Gestione del rimpiazzo di unità difettose o obsolete.
- **Distruzione**: Certificazione della distruzione sicura (fine vita o disarmo).
- **Donazione**: Trasferimento di proprietà a titolo gratuito (aiuti umanitari/militari).

### 3.3 Visualizzazione e Reportistica
- Visualizzazione del catalogo armi filtrabile per:
  - **Categoria** (es. Armi leggere, Artiglieria, Mezzi corazzati)
  - **Tipo** (es. Fucile d'assalto, Pistola, Obice)
  - **Marca/Produttore** (es. Beretta, Lockheed Martin, Rheinmetall)

## 4. Schema Database (Preliminare)

### Tabella `Government`
- `id` (UUID, PK)
- `name` (String)
- `country_code` (String, ISO)
- `contact_email` (String)

### Tabella `WeaponType`
- `id` (UUID, PK)
- `name` (String)
- `category` (Enum: SmallArms, Artillery, Vehicles, etc.)
- `brand` (String)

### Tabella `Weapon`
- `id` (UUID, PK)
- `serial_number` (String, Unique)
- `weapon_type_id` (FK -> WeaponType)
- `status` (Enum: Available, Sold, UnderRepair, Destroyed)
- `current_owner_id` (FK -> Government)

### Tabella `Transaction`
- `id` (UUID, PK)
- `type` (Enum: Sale, Delivery, Reception, Return, Repair, Replacement, Destruction, Donation)
- `weapon_id` (FK -> Weapon)
- `equipment_id` (FK -> Equipment)
- `from_id` (Optional FK -> Government/Supplier)
- `to_id` (Optional FK -> Government/Supplier)
- `timestamp` (DateTime)
- `details` (JSON/Text)

## 5. Design UI/UX
- **Interfaccia**: Professionale, "Mission-Critical", con tema scuro predefinito e accenti di colore funzionali (es. Verde militare, Grigio acciaio).
- **Dashboard**: Vista riepilogativa delle vendite e dello stato delle consegne globali.
- **Filtri Avanzati**: Per la ricerca rapida negli arsenali registrati.

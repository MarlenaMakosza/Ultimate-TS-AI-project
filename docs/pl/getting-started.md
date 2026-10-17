# Pierwsze kroki

## Wymagania

- Node.js 24 (wersja jest w `.nvmrc`; ze starszą `npm install` odmówi instalacji) z wersją npm
  z pola `packageManager` w `package.json` (aktualizuj ją razem z Node)
- Docker, dla PostgreSQL
- git

## Instalacja

```sh
git clone https://github.com/MarlenaMakosza/Ultimate-TS-AI-project.git
cd Ultimate-TS-AI-project
nvm use
cp .env.example .env
npm run firstrun:dev
```

`firstrun:dev` instaluje zależności i sprawdza typy. Potem uruchamia PostgreSQL, wykonuje migracje
i wypełnia bazę danymi.

## Opcjonalnie: codebase-memory-mcp dla agentów AI

Możesz go zainstalować, ale nie musisz: wszystko w szablonie działa bez niego.

[codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) (MIT, darmowy) buduje mapę
kodu: jakie są funkcje, kto je wywołuje i co importuje co. Agent AI (Claude Code, Codex CLI,
Gemini CLI i inne) może wtedy zapytać mapę "gdzie to jest zdefiniowane" albo "co to wywołuje",
zamiast otwierać plik po pliku. Szybciej znajduje kod i zużywa mniej tokenów, co ma tym większe
znaczenie, im większy projekt. Mapa zostaje na twoim komputerze.

```sh
# Instalacja (Linux i macOS); skrypt od razu podłącza go do znalezionych agentów
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash
codebase-memory-mcp --version
```

Potem raz poproś agenta: "Index this repository with codebase-memory-mcp." `AGENTS.md` już każe
agentom z niego korzystać, gdy jest zainstalowany. Więcej w
[Pracy z agentami AI](./ai-workflow.md#opcjonalnie-graf-kodu-dla-agentow).

## Własny projekt na bazie szablonu

Utwórz swoje repozytorium z tego: na GitHubie przyciskiem **Use this template** albo sklonuj je,
usuń `.git` i uruchom `git init`. Potem przejdź tę listę. Każda grupa mieści się w jednym commicie,
a po każdej `npm run validate:full` powinien przechodzić.

**1. Nazwa i właściciel**

- `package.json`: zmień `name` i ustaw `version` na `0.0.0`. W `.release-please-manifest.json` też
  ustaw `0.0.0`.
- Usuń `CHANGELOG.md`: opisuje wydania szablonu. release-please założy nowy przy twoim pierwszym
  wydaniu.
- `LICENSE`: wpisz swoje imię i nazwisko oraz rok albo wybierz inną licencję.
- `.github/CODEOWNERS`: zamień `@MarlenaMakosza` na swoje konto.
- `README.md`, `docs/index.md` i `docs/pl/index.md`: tytuł, opis, adres w `git clone` i link do
  strony z dokumentacją.
- `.vitepress/config.ts`: `title` i `description`.

**2. Przykładowy kod: zastąp go swoją pierwszą funkcją**

Przykłady to wzorce, według których pracują agenci, więc zostaw każdy, dopóki nie zastąpi go twój
kod.

- Powitanie: `src/greet.ts`, `tests/unit/greet.test.ts`, `tests/e2e/features/greeting.feature`,
  `tests/e2e/steps/app.steps.ts`, `docs/edge-cases/greeting.md` i powitanie w `src/index.ts`.
  Role, `AGENTS.md` i dokumentacja podają te pliki jako wzorce stylu: `git grep -n greet` pokazuje
  wszystkie miejsca do poprawienia.
- Baza danych: tabela `users` w `src/db/schema.ts`, migracje w `drizzle/`, `dev/db/seed.ts` i
  `tests/integration/db/users.test.ts`. Gdy twój schemat będzie gotowy, usuń `drizzle/` i uruchom
  `npm run db:generate`, żeby pierwsza migracja była twoja.
- `dev/logger-example.ts` i skrypt `example:logger`: usuń je, gdy poznasz już logger.
- `.archgate/adrs/GEN-001-example.md`: usuń go. `ARCH-001` i `ARCH-002` zostaw, dopóki obowiązują.

**3. Dokumentacja o szablonie**

- `docs/architecture/`: strony arc42 opisują szablon. Napisz od nowa wprowadzenie i cele, kontekst
  i słownik dla swojego projektu; zostaw konwencje i decyzje, których nadal się trzymasz. Które
  sekcje się opłacają, opisuje [Architektura](./architecture/index.md).
- Polska dokumentacja: jeśli jej nie potrzebujesz, usuń `docs/pl/` i wpis `pl` w `locales` w
  `.vitepress/config.ts`.

**4. Części, których możesz nie potrzebować**

- Bez bazy danych: usuń `src/db/`, `dev/db/`, `drizzle/`, `drizzle.config.ts`, `docker-compose.yml`,
  `tests/integration/` i `vitest.integration.config.ts`; skrypty `db:*`, `seed:dev` i
  `test:integration` oraz kroki bazy w `firstrun:dev`; job `integration` w `.github/workflows/ci.yml`; `DATABASE_URL` w `src/env.ts`
  i `.env.example`; oraz paczki Drizzle, postgres i Testcontainers. knip pokaże potem, co zostało.
- Bez agentów AI: zobacz [Usunięcie konfiguracji AI](./ai-workflow.md#usuniecie-konfiguracji-ai).

**5. Sprawdzenie**

Uruchom `npm run validate:full` i `npm run format:check`, a potem wprowadź
[ustawienia GitHuba](#ustawienia-githuba).

## Na co dzień

```sh
npm run dev             # uruchamia src/index.ts i restartuje go po każdej zmianie
npm run validate        # szybkie bramki jakości
npm run validate:full   # wszystkie bramki: odpal przed uznaniem zadania za skończone
```

Pozostałe komendy są w [Skryptach](./scripts.md), a to, co sprawdza każda bramka, w
[Bramkach jakości](./quality-gates.md).

## Wydania

Wersje są zgodne z [SemVer](https://semver.org/) i wynikają z wiadomości w historii gita, które
`commitlint` już pilnuje w formacie Conventional Commits: `fix:` podbija wersję patch, `feat:`
wersję minor, a zmiana łamiąca (`feat!:` albo `BREAKING CHANGE:`) wersję major. Przed 1.0.0 zmiana
łamiąca podbija wersję minor.

Po każdym merge'u na `main` release-please aktualizuje otwarty release PR z następną wersją i
nowymi wpisami w `CHANGELOG.md`. Merge tego PR taguje wersję i tworzy GitHub Release. Nigdy nie
edytuj `CHANGELOG.md` ani wersji ręcznie.

release-please potrzebuje kilku ustawień repo: zobacz [Ustawienia GitHuba](#ustawienia-githuba).

## Ustawienia GitHuba

Jeśli projekt jest na GitHubie, ustaw to raz w ustawieniach repo.

**Settings → General → Pull Requests**

- Wyłącz **Allow merge commits** i **Allow rebase merging**, zostaw **Allow squash merging**.
- Przy squash merging ustaw **Default commit message** na **Pull request title and description**.
- Włącz **Automatically delete head branches**.

Dzięki temu każdy PR trafia na `main` jako jeden commit: tytuł PR to jego pierwsza linia, a opis to
jego treść. Dostaje jeden wpis w `CHANGELOG.md`. Dlatego:

- **Tytuł PR musi być w formacie Conventional Commits** (`feat: …`, `fix: …`, `docs: …`): to on
  decyduje o następnej wersji.
- Wiersze `Assisted-by` na końcu opisu stają się trailerami tej
  zmiany, więc
  [statystyki AI](./ai-workflow.md#podpisy-ai-i-statystyki) mogą je policzyć.
- Pisz `BREAKING CHANGE:` w opisie tylko przy prawdziwej zmianie łamiącej: podbija wersję major. Merge commit dodałby każdą
  zmianę do CHANGELOG dwa razy: raz za commit i raz za merge commit, który powtarza tytuł PR.

**Settings → Pages → Build and deployment**

- Ustaw **Source** na **GitHub Actions**. Workflow Docs (`.github/workflows/pages.yml`)
  publikuje wtedy tę dokumentację przy każdym wypchnięciu na `main`.

**Settings → Actions → General → Workflow permissions**

- Włącz **Allow GitHub Actions to create and approve pull requests**. Bez tego release-please nie
  otworzy release PR.

**Settings → Advanced Security**

`npm run security:audit` i `eslint-plugin-security` nie wymagają żadnego ustawienia. `SECURITY.md`
wymaga jednego:

- Włącz **Private vulnerability reporting**. `SECURITY.md` prosi, żeby lukę zgłaszać prywatnie,
  przez **Security → Report a vulnerability**. Bez tego ustawienia tego przycisku nie ma.
- Opcjonalnie: **Dependabot alerts**. GitHub pokazuje wtedy znane luki we wszystkich
  zależnościach, także w narzędziach deweloperskich; `npm run security:audit` sprawdza tylko
  zależności runtime (zobacz [Bramki jakości](./quality-gates.md)). Na start spodziewaj się kilku
  tuzinów alertów, prawie wszystkich w narzędziach, które nigdy nie działają na produkcji, i
  domyślnie e-maila o każdym. E-maile wyłączysz w swoich osobistych **Settings → Notifications →
  Dependabot alerts**. Zostaw wyłączone **Dependabot security updates**: otwiera PR dla każdej
  poprawki, a zależności i tak aktualizuje
  `npm run update-dependencies`.

**Settings → Rules → Rulesets** (albo **Settings → Branches**), dla `main`

- Wymagaj PR przed merge i przechodzących sprawdzeń CI: `validate`, `integration`, `mutation` i `e2e`.
  `validate` zawiera `npm run security:audit`.
- Na release PR nie uruchamia się CI, bo GitHub nie startuje workflow dla zmian zrobionych
  domyślnym `GITHUB_TOKEN`. Przy wymaganych sprawdzeniach dodaj siebie do listy obejść (bypass) albo daj
  release-please osobisty token (pole `token` w akcji).

Po merge GitHub usuwa gałąź zdalną, ale twoja lokalna kopia zostaje. Usuń ją też, bo inaczej
następny `git push --all` ją przywróci:

```sh
git switch main && git pull
git fetch --prune
git branch -D <gałąź>   # -D: po squash merge git nie uznaje gałęzi za scaloną
```

## Struktura projektu

```text
src/                  kod aplikacji
  db/                 schemat i klient Drizzle
tests/unit/           testy jednostkowe Vitest
tests/integration/    testy Vitest na prawdziwej bazie (Testcontainers, wymaga Dockera)
tests/e2e/features/   scenariusze Gherkin (specyfikacja)
tests/e2e/steps/      step definitions i fixtures
drizzle/              migracje bazy danych, generuje je npm run db:generate
dev/db/               skrypty migracji i danych testowych
dev/quality/          bramka CRAP
docs/                 ta dokumentacja (VitePress); polska wersja w docs/pl/
.archgate/adrs/       decyzje architektoniczne (ADR)
.agents/roles/        instrukcje ról dla agentów AI
.claude/              adapter dla Claude Code (hooki, uprawnienia, agenci)
.github/              workflow CI, właściciele kodu, szablon opisu PR
```

[1mdiff --git a/.github/workflows/pull_request.yml b/.github/workflows/pull_request.yml[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/.gitignore b/.gitignore[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/.vscode/settings.json b/.vscode/settings.json[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/README.md b/README.md[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/biome.json b/biome.json[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/bun.lock b/bun.lock[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mindex 9a10f0b..8891d22[m
[1m--- a/bun.lock[m
[1m+++ b/bun.lock[m
[36m@@ -1,5 +1,6 @@[m
 {[m
   "lockfileVersion": 1,[m
[32m+[m[32m  "configVersion": 0,[m
   "workspaces": {[m
     "": {[m
       "name": "bot-psy-python",[m
[1mdiff --git a/data/titles.ts b/data/titles.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/package.json b/package.json[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/client.ts b/src/client.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/commands/infos.ts b/src/commands/infos.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/commands/profil.ts b/src/commands/profil.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/commands/question.ts b/src/commands/question.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/commands/setExperience.ts b/src/commands/setExperience.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/commands/upload.ts b/src/commands/upload.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/database/database.ts b/src/database/database.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/database/models/User.ts b/src/database/models/User.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/database/models/answer.ts b/src/database/models/answer.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/database/models/dailyFact.ts b/src/database/models/dailyFact.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/database/models/question.ts b/src/database/models/question.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/enums/permissionsLevel.ts b/src/enums/permissionsLevel.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/events/clientReady.ts b/src/events/clientReady.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/events/interactionCreate.ts b/src/events/interactionCreate.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/handlers/commandsHandler.ts b/src/handlers/commandsHandler.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/handlers/eventsHandler.ts b/src/handlers/eventsHandler.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/index.ts b/src/index.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/managers/daily_fact.ts b/src/managers/daily_fact.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/services/experienceService.ts b/src/services/experienceService.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/services/fileService.ts b/src/services/fileService.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/services/questionsService.ts b/src/services/questionsService.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/services/userService.ts b/src/services/userService.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/types/commandInterface.ts b/src/types/commandInterface.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/types/context.ts b/src/types/context.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/types/discord.d.ts b/src/types/discord.d.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/types/env.d.ts b/src/types/env.d.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/types/event.d.ts b/src/types/event.d.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/ui/container.ts b/src/ui/container.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/utils/cooldowns.ts b/src/utils/cooldowns.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/src/utils/logging.ts b/src/utils/logging.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/tests/integration/experience.int.test.ts b/tests/integration/experience.int.test.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/tests/integration/questions.int.test.ts b/tests/integration/questions.int.test.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/tests/integration/user.int.test.ts b/tests/integration/user.int.test.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/tests/unit/experience.test.ts b/tests/unit/experience.test.ts[m
[1mold mode 100644[m
[1mnew mode 100755[m
[1mdiff --git a/tsconfig.json b/tsconfig.json[m
[1mold mode 100644[m
[1mnew mode 100755[m

---
title: What queue ring strategies are available?
sidebar_position: 8
---

# What queue ring strategies are available and how can I delay ringing for an agent?

NethVoice queues support several Asterisk ring strategies:

* `leastrecent` - rings the agent least recently called by the queue
* `fewestcalls` - rings the agent with the fewest completed calls
* `random` - rings a random agent
* `rrmemory` - round robin, remembering where the previous ring cycle ended
* `rrordered` - like `rrmemory`, but preserves the configured member order
* `linear` - rings agents in the configured order
* `wrandom` - randomly selects agents using their penalty as a weighting factor

Some strategies, such as `linear` and round-robin strategies, may require an **Asterisk restart** after changing the queue configuration.

:::warning Note about the `ringall` strategy

The **`ringall` strategy is not recommended**, especially for queues with many agents.

With `ringall`, for each queued call Asterisk generates a call toward **all available agents at the same time**. Each call attempt toward an agent must be considered as a **separate concurrent call**, also for **hardware sizing** and overall system load.

For example, a single call handled by a `ringall` queue with 20 available agents can generate up to **20 concurrent calls toward the agents**.

This strategy is also less efficient from a service perspective: a single queued call can engage all available agents at the same time, instead of distributing calls among agents according to criteria such as availability, number of handled calls, or rotation.

Whenever possible, it is preferable to use strategies such as `random`, `leastrecent`, `fewestcalls`, `rrmemory`, or `rrordered`, choosing the one that best fits the service requirements, and to enable `Autofill` in the queue's advanced settings to distribute multiple calls simultaneously.
:::

## How can I configure delayed ringing for an agent?

Use different **Penalty** values for queue members.

For example:

```text
200 - penalty 0
201 - penalty 0
202 - penalty 1
206 - penalty 2
```

Agents with a lower penalty are called first, while agents with a higher penalty can be involved later.

## What are Lazy Members?

To allow Asterisk to move to agents with a **higher penalty** even when lower-penalty agents are online and reachable, **Lazy Members must be enabled**.

Without Lazy Members, if an agent with a lower penalty is available and contactable, Asterisk continues to consider that agent eligible and does not automatically move to the next penalty level.

With **Lazy Members enabled**, the queue can progressively include agents with higher penalties, allowing delayed ringing based on the configured penalty levels.

You can enable this option from the queue configuration:

**Advanced options → Other Options → Lazy Members**

This option is therefore required when penalties are used to implement progressive or delayed ringing between groups of agents.


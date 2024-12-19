import { vi } from "vitest"
import { AggregateRoot } from "../entities/aggregate-root"
import { UniqueEntityID } from "../entities/unique-entity-id"
import { DomainEvent } from "./domain-event"
import { DomainEvents } from "./domain-events"

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))
    return aggregate
  }
}

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

describe("domain events", () => {
  it("should be able to dispatch and listen events", () => {
    const callbackSpy = vi.fn()

    // Subscriber cadastrado (Ouvindo o "evento de resposta criada")
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Estou Criando uma resposta porem Sem salvar no banco
    const aggregate = CustomAggregate.create()

    // Estou assegurando que o evento foi criado porem Não foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // Estou Salvando a resposta no banco de dados e assim disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // O subscriber ouve o evento e faz oque precisa ser feito com o dado.
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})

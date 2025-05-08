import { Play } from 'phosphor-react'
import { useForm, reset } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'
import { useEffect, useState } from 'react'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Infome a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O cliclo precisa ser no mínimo 5 minutos')
    .max(60, 'O cliclo precisa ser no máximo 60 minutos'),
})

/* interface NewCycleFormData {
  task: string,
  minutesAmount: number
} */

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string,
  task: string,
  minutesAmount: number
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondPassed, setAmountSecondPassed] = useState(0)
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      minutesAmount: 0,
      task: '',
    },
  })

  const handleCreateNewCycle = function (data:NewCycleFormData) {
    const id = String(new Date().getTime())

    const newCycle:Cycle = {
      id,
      minutesAmount: data.minutesAmount,
      task: data.task,
    }

    setCycles(cycle => [...cycle, newCycle])
    setActiveCycleId(id)
    countDown()
    reset()
  }

  function countDown() {
    setInterval(() => setAmountSecondPassed(amountSecondPassed => amountSecondPassed + 1), 1000)
  }

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  const totalSeconds = activeCycle
    ? activeCycle.minutesAmount * 60
    : 0

  const curentSeconds = activeCycle
    ? totalSeconds - amountSecondPassed
    : 0

  const minutesAmount = Math.floor(curentSeconds / 60)
  const secondsAmount = Math.floor(curentSeconds % 60)

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            placeholder="Dê um nome para o seu projeto"
            id="task"
            list="task-suggestions"
            {...register('task')}
          />
          <datalist id="task-suggestions">
            <option>Projeto 1</option>
            <option>Projeto 2</option>

          </datalist>
          <label htmlFor="minutesAmount">Durante</label>
          <MinutesAmountInput
            placeholder="00"
            id="minutesAmount"
            type="number"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />
          <span>minutos.</span>
        </FormContainer>
        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>

          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>

        </CountdownContainer>
        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} /> Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}

import argparse
import math
# import logging

def calc(number_of_mobs: int, to_hit_roll: int, to_hit_out_of: int = 20, print=print):
    # example: 8 mobs to roll 15 to hit

    # probability of a hit for each creature:
    default_hit_prob = ((to_hit_out_of+1-to_hit_roll) / to_hit_out_of) # todo add 1 for starting at 1 instead of 0

    # default_hit_prob=0.
    # print(default_hit_prob)
    prob_n_hits = [math.comb(number_of_mobs,i) * default_hit_prob ** i * (1-default_hit_prob)**(number_of_mobs-i) for i in range(number_of_mobs+1)]
    print(prob_n_hits)
    print(f"prob of exactly 0 : {prob_n_hits[0]}")
    print(f"prob of exactly {number_of_mobs} : {prob_n_hits[number_of_mobs]}")
    # accum = 0
    # prob_at_least_n_hits = [0.0]*(number_of_mobs+1)
    # # accumulate in reverse
    # for i in range(number_of_mobs, -1, -1):
    #     p = prob_n_hits[i]
    #     accum += p
    #     prob_at_least_n_hits[i] = accum
    # print(prob_at_least_n_hits)

    # print([1-p for p in prob_at_least_n_hits])

    # # 22 buckets because there's <1, 1,2,3,...,20, >20
    # d20_dist = [(22 *(1-p)) for p in prob_at_least_n_hits]
    # print(d20_dist)
    # d20_dist = [math.floor(d) for d in d20_dist]
    # stretched = [(p-1/21)*(21/20) for p in prob_n_hits]

    # chunk_sizes = [(21)*p for p in prob_n_hits]
    # print(chunk_sizes)
    accum = 0
    d1_dist = [-1.0] * (number_of_mobs)
    
    for i in range(number_of_mobs):
        # print(chunk_sizes[i] + accum)
        accum += prob_n_hits[i]
        d1_dist[i]=accum
        # d20_dist[i]=math.floor(1+accum)
        # print(f"Would have to roll at least floor of {(1+accum)} to hit {i+1} times")
    # print(chunk_sizes)
    print(d1_dist)

    d20_dist = [math.floor(21*p+1) for p in d1_dist]
    # 1+x\left(m+h\right)-\left(s_{2}\left(m+h\right)\right)
    def to_dice_result(dice_size, p):
        return round(p*dice_size+1)
        # slope_modifier = dice_size+ (dice_size/(dice_size-1))
        # shift_modifier = 1/(2*dice_size)
        # return math.floor(p* slope_modifier - shift_modifier*slope_modifier +1)
    d20_dist = [to_dice_result(to_hit_out_of,p) for p in d1_dist]
    # d20_dist = [round(21*p) for p in d1_dist]

    return d20_dist

    return []


def hit_times_to_dice_rolls(results: list[int]):
    dice_rolls = [-1]*20
    for i,r in enumerate(results):
        dice_rolls[i] = r

def test1d20():
    for i in range(1,20):
        result = calc(1,i,20,print=lambda x:x)
        assert result[-1] == i

def test():
    test1d20()
    
def main():
    parser = argparse.ArgumentParser(description="Turn 8 dice rolls into one")
    # parser.add_argument("--num", "-o", help="How many creatures in a mob", default=None)
    # parser.add_argument("--dc", "-o", help="What a mob creature has to roll to hit", default=None)
    parser.add_argument("--test", "-t", help="Run tests and quit", default=False, type=bool)
    parser.add_argument("num", nargs="?", help="How many creatures in a mob", type=int)
    parser.add_argument("dc", nargs="?", help="What a mob creature has to roll to hit",type=int)

    args = parser.parse_args()

    # Main logic here
    print(f"args: {args}")

    if args.test:
        test()
        return

    result = calc(args.num, args.dc)
    print("Results:")
    for i in range(len(result)):
        print(f"To hit {i+1} times, need to roll at least {result[i]}")

    return 0


if __name__ == "__main__":
    main()

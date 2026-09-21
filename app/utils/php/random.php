<?php

function rand_true($percent = 50)
{
    return rand(1, 100) <= $percent;
}

function rand_id()
{
    return rand(100000000000, 999999999999);
}
